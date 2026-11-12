import json
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
import random

#import webscraping playwright tools
from playwright.sync_api import sync_playwright

#code to allow to use firebase

#import firebase functionality
import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('ssentialServiceKey.json')

#initialize. make app point to database
firebase_admin.initialize_app(cred)

#upload data to firebase
#object we use to communicate with firestore
db = firestore.client()

#find product url json file
URLS_FILE = Path(__file__).parent / "product_urls.json"
all_products = []
seen_urls = set()
if URLS_FILE.exists():
    with open(URLS_FILE, "r") as file:
        seen_urls = set(json.load(file))


#opening pages/website, accounting for erros


#close browser once code done
with sync_playwright() as p:
    #create browser object u can work w
        #headless= whether u want see browser. false=no
        #slowmo = slowsdown to see stuff better
    browser = p.chromium.launch(headless=False)
    

    #page object to interact with 
        #what is page object?
    page = browser.new_page()

    #FIRST PATHWAY: UPLOAD FIRST TIME
    #check if scraper empty

    if not seen_urls:
        print("No saved product URLs found. Discovering products...")

        page_number = 1
        target_products = 200

        while len(all_products) < target_products:

            # Open current page
            category_url = f"https://www.ssense.com/en-us/women?page={page_number}"

            response = page.goto(
                category_url,
                wait_until="domcontentloaded",
                timeout=30000
            )

            print(f"SSENSE Page {page_number} opened!", flush=True)

            # Check if error
            if response is None or response.status != 200:
                print(f"Could not open page {page_number}. Stopping.")
                break

            # Check verification
            if "just a moment" in page.title().lower():
                print("SSENSE returned a security verification page.")
                break

            # Find product cards
            products = page.locator('a:has(script[type="application/ld+json"])')

            print(f"Found {len(products.all())} product cards.")

            products_before_page = len(all_products)
            # Go through each product card
            for card in products.all():

                product_data = json.loads(card.locator('script').inner_text())
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
                    "image_url": product_data.get("image"),
                    "category": "Womenswear" if "/women/" in product_url else "Mens Clothing",
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
            page.wait_for_timeout(wait_time * 1000)

        # Save product URLs
        with open(URLS_FILE, "w") as file:
            json.dump(list(seen_urls), file, indent=4)
        
        #ADDING TO FIRESTORE
        #add product to database. 
            #store with product id to prevent duplicates
            #doc_ref stores specific collection u select
        
        # Save product data locally
        with open("products.json", "w") as file:
            json.dump(all_products, file, indent=4)

        print(f"Successfully saved {len(all_products)} products!")

        # Upload products to Firestore
        for product in all_products:
            product_id = product["product_id"]

            # Create product document reference
            doc_ref = db.collection("products").document(product_id)

            # Upload product information
            doc_ref.set(product)

            # Create daily price history
            today = datetime.now(ZoneInfo("America/New_York")).strftime("%Y-%m-%d")
            price_ref = doc_ref.collection("priceHistory").document(today)

            price_ref.set({
                "price": product["displayed_price"],
                "currency": product["currency"]
            })



    else:
        # SECOND PATHWAY: EXTRACT FROM SAME URLs

        # Access products collection
        products_ref = db.collection("products")

        # Retrieve all product documents
        products = products_ref.stream()

        print("Checking products in Firestore...")

        # Go through each product document
        for product_doc in products:

            # Retrieve document ID and product information
            product_id = product_doc.id
            product_data = product_doc.to_dict()
            product_url = product_data["product_url"]

            # Wait 3–5 seconds
            wait_time = random.randint(3, 5)
            print(f"Waiting {wait_time} seconds...")
            page.wait_for_timeout(wait_time * 1000)

            print(f"Opening: {product_url}")

            response = page.goto(
                product_url,
                wait_until="domcontentloaded",
                timeout=30000
            )

            # Check for errors
            if response is None:
                print("Could not open product. No response received.")
                continue

            if response.status != 200:
                print(f"Could not open product. Status: {response.status}")
                continue

            print("Product page opened!")

            # Retrieve product information from JSON-LD
            product_script = page.locator(
                'script[type="application/ld+json"]'
            ).first

            product_data = json.loads(product_script.inner_text())

            # Create updated product dictionary
            product = {
                "product_id": product_id,
                "brand": product_data["brand"]["name"],
                "name": product_data["name"],
                "displayed_price": product_data["offers"]["price"],
                "currency": product_data["offers"]["priceCurrency"],
                "product_url": product_data["url"],
                "image_url": product_data.get("image"),
                "category": "Womenswear" if "/women/" in product_data["url"] else "Mens Clothing",
                "scraped_at": datetime.now(ZoneInfo("America/New_York")).isoformat()
            }

            # Update the existing product document in Firestore
            doc_ref = product_doc.reference
            doc_ref.update(product)

            # Save today's price in price history
            today = datetime.now(ZoneInfo("America/New_York")).strftime("%Y-%m-%d")

            price_ref = doc_ref.collection("priceHistory").document(today)

            price_ref.set({
                "price": product["displayed_price"],
                "currency": product["currency"]
            })

            print(f"Updated Firebase product: {product_id}")

    browser.close()
