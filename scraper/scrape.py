import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

from playwright.async_api import async_playwright


CATEGORY_URL = "https://www.ssense.com/en-us/women/clothing"
OUTPUT_FILE = Path(__file__).parent / "products.json"


async def main():
    async with async_playwright() as p:
        # Open a visible browser for diagnosis.
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(locale="en-US")

        try:
            response = await page.goto(
                CATEGORY_URL,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            status = response.status if response else None
            title = await page.title()

            print(f"HTTP status: {status}")
            print(f"Page title: {title}")
            print(f"Current URL: {page.url}")

            # Do not treat a security challenge as product data.
            if status == 403 or "just a moment" in title.lower():
                print(
                    "\nSSENSE returned a security challenge. "
                    "No products were collected."
                )

                await page.screenshot(
                    path="access_check.png",
                    full_page=True,
                )
                print("Screenshot saved to access_check.png")
                return

            if status is not None and status >= 400:
                print("The category page returned an HTTP error.")
                return

            # Find product links on the category page.
            links = await page.locator(
                "a[href*='/product/']"
            ).all()

            products = []
            seen_urls = set()

            for link in links:
                href = await link.get_attribute("href")

                if not href:
                    continue

                product_url = urljoin(page.url, href)

                if product_url in seen_urls:
                    continue

                seen_urls.add(product_url)

                raw_text = await link.inner_text()
                lines = [
                    line.strip()
                    for line in raw_text.splitlines()
                    if line.strip()
                ]

                if not lines:
                    continue

                price_match = re.search(
                    r"\$\s*[\d,]+(?:\.\d{2})?",
                    raw_text,
                )

                price = None
                if price_match:
                    price = float(
                        price_match.group()
                        .replace("$", "")
                        .replace(",", "")
                        .replace(" ", "")
                    )

                products.append({
                    "brand": lines[0],
                    "name": lines[1] if len(lines) > 1 else None,
                    "displayed_price": price,
                    "currency": "USD",
                    "product_url": product_url,
                    "scraped_at": datetime.now(
                        timezone.utc
                    ).isoformat(),
                })

            # Print results.
            print(f"\nUnique product records: {len(products)}")
            print(json.dumps(products[:10], indent=2))

            # Save all collected records to JSON.
            OUTPUT_FILE.write_text(
                json.dumps(products, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )

            print(f"\nSaved {len(products)} records to {OUTPUT_FILE}")

        except Exception as error:
            print(f"Scraper error: {error}")

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())