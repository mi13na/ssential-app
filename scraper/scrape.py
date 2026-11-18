import json
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
import random

# import botasaurus tools
from botasaurus.browser import browser, Driver

# code to allow to use firebase

# import firebase functionality
import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore

SCRAPER_DIR = Path(__file__).resolve().parent

cred = credentials.Certificate(SCRAPER_DIR / 'ssentialServiceKey.json')

# initialize. make app point to database
firebase_admin.initialize_app(cred)

# object we use to communicate with firestore
db = firestore.client()

# find product url json file and product data json file
URLS_FILE = SCRAPER_DIR / "product_urls.json"
DATA_FILE = SCRAPER_DIR / "products.json"

all_products = []
seen_urls = set()
if URLS_FILE.exists():
    with open(URLS_FILE, "r") as file:
        seen_urls = set(json.load(file))

# javascript that returns the JSON-LD blocks on the page
GET_ALL_JSON_LD = """
return [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => s.textContent);
"""

# javascript that returns the JSON-LD blocks inside product cards
GET_CARD_JSON_LD = """
return [...document.querySelectorAll('a script[type="application/ld+json"]')]
    .map(s => s.textContent);
"""


def today():
    return datetime.now(ZoneInfo("America/New_York")).strftime("%Y-%m-%d")


# SSENSE's JSON-LD image urls contain a "__IMAGE_PARAMS__" placeholder that
# their site fills in; without it the url 404s, so fill in the size settings
IMAGE_PARAMS = "b_white,c_lpad,g_south,ar_2:3/f_auto,c_limit,w_480,q_85"


def image_url(product_data):
    image = product_data.get("image")
    return image.replace("__IMAGE_PARAMS__", IMAGE_PARAMS) if image else image


# add today's price to the product's priceHistory subcollection
# one document per day (id = date), so earlier days are never overwritten
# and a retry later the same day just refreshes today's entry
def save_price_history(doc_ref, product):
    doc_ref.collection("priceHistory").document(today()).set({
        "price": product["displayed_price"],
        "currency": product["currency"],
        "scraped_at": product["scraped_at"]
    })


# open the browser, close it automatically once the function finishes
# headless=False means you can see the browser
# raise_exception + close_on_crash: on an error, exit with a failure instead of
# pausing for Enter, so run_daily.sh sees it failed and retries on the next trigger
@browser(headless=False, output=None, raise_exception=True, close_on_crash=True)
def scrape(driver: Driver, data):

    # FIRST PATHWAY: UPLOAD FIRST TIME
    # check if scraper empty
    if not seen_urls:
        print("No saved product URLs found. Discovering products...")

        page_number = 1
        target_products = 200

        while len(all_products) < target_products:

            # Open current page
            category_url = f"https://www.ssense.com/en-us/women?page={page_number}"
            driver.get(category_url, bypass_cloudflare=True)
            driver.sleep(random.uniform(3, 5))

            print(f"SSENSE Page {page_number} opened!", flush=True)

            # Check verification
            if "just a moment" in driver.title.lower():
                print("SSENSE returned a security verification page.")
                break

            # Find product cards
            cards = driver.run_js(GET_CARD_JSON_LD)
            print(f"Found {len(cards)} product cards.")

            products_before_page = len(all_products)

            # Go through each product card
            for card in cards:

                product_data = json.loads(card)
                product_url = product_data["url"]

                # Skip duplicates
                if product_url in seen_urls:
                    continue

                seen_urls.add(product_url)

                # Create product dictionary
                product = {
                    "product_id": product_data.get("productID") or product_url.rstrip("/").split("/")[-1],
                    "brand": product_data["brand"]["name"],
                    "name": product_data["name"],
                    "displayed_price": product_data["offers"]["price"],
                    "currency": product_data["offers"]["priceCurrency"],
                    "product_url": product_url,
                    "image_url": image_url(product_data),
                    "category": "Womenswear" if "/women/" in product_url else "Other",
                    "scraped_at": datetime.now(ZoneInfo("America/New_York")).isoformat()
                }

                # Add product to list
                all_products.append(product)

                print(f"Products collected: {len(all_products)}")

                # Stop when we reach 200
                if len(all_products) >= target_products:
                    break

            if len(all_products) == products_before_page:
                print("No new products found. Stopping.")
                break

            # Check if target reached
            if len(all_products) >= target_products:
                print("Reached 200 products!")
                break

            # Move to next page
            page_number += 1

            # Wait 2-5 seconds
            wait_time = random.randint(2, 5)
            print(f"Waiting {wait_time} seconds...")
            driver.sleep(wait_time)

        # fail so run_daily.sh retries instead of marking today done
        if not all_products:
            raise RuntimeError("No products collected.")

        # Save product URLs
        with open(URLS_FILE, "w") as file:
            json.dump(list(seen_urls), file, indent=4)

        # Save product data locally
        with open(DATA_FILE, "w") as file:
            json.dump(all_products, file, indent=4)

        print(f"Successfully saved {len(all_products)} products!")

        # ADDING TO FIRESTORE
        # add product to database.
            # store with product id to prevent duplicates
            # doc_ref stores specific document u select

        # Upload products to Firestore
        for product in all_products:
            product_id = product["product_id"]

            # Create product document reference
            doc_ref = db.collection("products").document(product_id)

            # Upload product information
            # merge=True keeps any fields already on the document
            doc_ref.set(product, merge=True)

            # Add today's price to the price history
            save_price_history(doc_ref, product)

        print("Uploaded products to Firestore!")


    else:
        # SECOND PATHWAY: EXTRACT FROM SAME URLs

        # Access products collection
        products_ref = db.collection("products")

        # Retrieve all product documents
        # list() loads them all first so the connection doesn't stay open during the slow scraping
        products = list(products_ref.stream())

        print("Checking products in Firestore...")

        updated_count = 0

        # Go through each product document
        for product_doc in products:

            # Retrieve document ID and product information
            product_id = product_doc.id
            saved_data = product_doc.to_dict()
            product_url = saved_data["product_url"]

            # Wait 3-5 seconds
            wait_time = random.randint(3, 5)
            print(f"Waiting {wait_time} seconds...")
            driver.sleep(wait_time)

            print(f"Opening: {product_url}")

            try:
                driver.get(product_url, bypass_cloudflare=True)
            except Exception as error:
                print(f"Could not open product. {error}")
                continue

            print("Product page opened!")

            # Retrieve product information from JSON-LD (pick the Product block)
            product_data = None
            for raw in driver.run_js(GET_ALL_JSON_LD):
                try:
                    block = json.loads(raw)
                except json.JSONDecodeError:
                    continue
                if isinstance(block, dict) and block.get("@type") == "Product":
                    product_data = block
                    break

            if product_data is None:
                print("No product data found on page. Skipping.")
                continue

            # Create updated product dictionary
            product = {
                "product_id": product_id,
                "brand": product_data["brand"]["name"],
                "name": product_data["name"],
                "displayed_price": product_data["offers"]["price"],
                "currency": product_data["offers"]["priceCurrency"],
                "product_url": product_data["url"],
                "image_url": image_url(product_data),
                "category": "Womenswear" if "/women/" in product_data["url"] else "Other",
                "scraped_at": datetime.now(ZoneInfo("America/New_York")).isoformat()
            }

            # Update the existing product document in Firestore
            doc_ref = product_doc.reference
            doc_ref.update(product)

            # Add today's price to the price history
            save_price_history(doc_ref, product)

            updated_count += 1
            print(f"Updated Firebase product: {product_id}")

        print(f"Updated {updated_count} of {len(products)} products.")

        # nothing updated usually means no network or a block page
        # fail so run_daily.sh retries instead of marking today done
        if updated_count == 0:
            raise RuntimeError("No products were updated.")


# run the scraper
scrape()