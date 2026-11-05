import json
from datetime import datetime
from zoneinfo import ZoneInfo
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
        








#opening pages/website, accounting for erros


#close browser once code done
with sync_playwright() as p:
    #create browser object u can work w
        #headless= whether u want see browser. false=no
        #slowmo = slowsdown to see stuff better
    browser = p.chromium.launch(headless=True)
    

    #page object to interact with 
        #what is page object?
    page = browser.new_page()
    #product and product url list
    all_products = []
    seen_urls = set()
    #go to webpage. don't wait for networkidle, tracking scripts keep it busy forever
    response = page.goto('https://www.ssense.com/en-us/women', wait_until="domcontentloaded")

    #check if blocked or verification page. exit 1 so the github action fails
    if response is None or response.status == 403 or "just a moment" in page.title().lower():
        print(f"SSENSE blocked the request (status {response.status if response else None}, title {page.title()!r}).")
        browser.close()
        raise SystemExit(1)

    #wait for product cards to load
    page.wait_for_selector('a:has(script[type="application/ld+json"])', timeout=30000)









#product scraping


    #count no. of product cards on page
        #Each product card has an <a> element containing a JSON-LD script. 
        #Use that pattern to identify product cards.
    print(len(page.locator('a:has(script[type="application/ld+json"])').all()))

    #create list of all product cards inc their dictionaries
    products = page.locator('a:has(script[type="application/ld+json"])')
        #go through each, turn data into python dictionary
    for card in products.all():
        product_data = json.loads(card.locator('script').inner_text())
        product_url = product_data["url"]

        if product_url in seen_urls:
            continue

        seen_urls.add(product_url)

        #connect key-value pairs in dictionary
        product = {
            "brand": product_data["brand"]["name"],
            "name": product_data["name"],
            "displayed_price": product_data["offers"]["price"],
            "currency": product_data["offers"]["priceCurrency"],
            "product_url": product_data["url"],
            "scraped_at": datetime.now(ZoneInfo("America/New_York")).isoformat()        }
        #add keyvalues to product list
        all_products.append(product)
        

        #ADDING TO FIRESTORE
        #add product to database. 
            #store with product id to prevent duplicates
            #doc_ref stores specific collection u select
        product_id = product["product_url"].rstrip("/").split("/")[-1]

        doc_ref = db.collection("products").document(product_id)

        #adding data to products collection on firebase
        doc_ref.set(product)

    #create json file and write product dic info to it
    with open("products.json", "w") as file:
        json.dump(all_products, file, indent=4)

    #check if product info saved
    print(f"Successfully saved {len(all_products)} products!")
    

