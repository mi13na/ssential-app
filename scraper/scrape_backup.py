
import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

from playwright.async_api import async_playwright


BASE_URL = "https://www.ssense.com"

CATEGORY_URLS = [
    "/en-us/women/clothing",
    "/en-us/women/shoes",
    "/en-us/women/bags",
    "/en-us/women/accessories",
    "/en-us/men/clothing",
    "/en-us/men/shoes",
    "/en-us/men/bags",
    "/en-us/men/accessories",
]

OUTPUT_FILE = Path(__file__).parent / "products.json"

MAX_PAGES_PER_CATEGORY = 30
MAX_SCROLLS = 8
DETAIL_DELAY_SECONDS = 1.0

# Keep this list selective: these are useful distinguishing features.
SPECIAL_FEATURES = [
    "padded shoulders",
    "patch pockets",
    "chest pockets",
    "cropped hem",
    "pleated",
    "embroidered",
    "quilted",
    "ribbed trim",
    "asymmetric",
    "cutout",
    "distressed",
    "fringed",
    "ruffled",
    "pleated",
    "contrast stitching",
    "drawstring",
    "belted",
    "double-breasted",
    "single-breasted",
    "water-resistant",
    "waterproof",
    "hooded",
    "sheer",
    "oversized",
    "adjustable straps",
]


def clean_text(value):
    if not value:
        return None

    value = re.sub(r"\s+", " ", value).strip()
    return value or None


def normalize_url(url):
    url, _ = urldefrag(url)
    parsed = urlparse(url)

    # Remove query parameters so tracking URLs deduplicate.
    return parsed._replace(
        scheme="https",
        netloc="www.ssense.com",
        query="",
        fragment="",
    ).geturl().rstrip("/")


def parse_price(value):
    if not value:
        return None

    match = re.search(r"\$\s*([\d,]+(?:\.\d{2})?)", value)

    if not match:
        return None

    try:
        return float(match.group(1).replace(",", ""))
    except ValueError:
        return None


async def dismiss_popups(page):
    """Try common consent and newsletter dismissal controls."""
    labels = [
        "Accept all cookies",
        "Accept All",
        "Accept cookies",
        "Allow all",
        "Reject all",
        "Decline",
        "Close",
        "No thanks",
        "Not now",
    ]

    for label in labels:
        try:
            button = page.get_by_role(
                "button", name=re.compile(
                    rf"^{re.escape(label)}$", re.I
                )
            ).first

            if await button.is_visible(timeout=500):
                await button.click(timeout=1500)
                await page.wait_for_timeout(300)
        except Exception:
            pass


async def check_access(page, response):
    title = (await page.title()).lower()
    body = ""

    try:
        body = (await page.locator("body").inner_text())[:3000].lower()
    except Exception:
        pass

    if (
        (response and response.status in (403, 429))
        or "just a moment" in title
        or "verify you are human" in body
        or "access denied" in title
    ):
        raise RuntimeError(
            "SSENSE returned a block, rate limit, or security challenge. "
            "Stopping rather than attempting to bypass it."
        )


async def collect_listing_links(page):
    """Scroll a listing and collect product and pagination URLs."""
    product_urls = set()
    pagination_urls = set()

    for _ in range(MAX_SCROLLS):
        await dismiss_popups(page)

        links = page.locator("a[href]")

        for i in range(await links.count()):
            link = links.nth(i)
            href = await link.get_attribute("href")

            if not href:
                continue

            absolute = normalize_url(urljoin(page.url, href))
            parsed = urlparse(absolute)

            if parsed.netloc != "www.ssense.com":
                continue

            path = parsed.path.lower()

            if "/product/" in path:
                product_urls.add(absolute)

            # Collect pagination links, but not designer/product links.
            elif (
                path.rstrip("/") == urlparse(page.url).path.rstrip("/")
                and re.search(r"(?:page|p)=\d+", urlparse(href).query)
            ):
                pagination_urls.add(absolute)

        # Allow lazy-loaded products to appear.
        await page.evaluate(
            "() => window.scrollTo(0, document.body.scrollHeight)"
        )
        await page.wait_for_timeout(700)

    return product_urls, pagination_urls


async def read_product_page(page, url, listing_info=None):
    response = await page.goto(
        url,
        wait_until="domcontentloaded",
        timeout=30000,
    )

    await check_access(page, response)
    await dismiss_popups(page)

    try:
        await page.locator("body").wait_for(timeout=5000)
        await page.wait_for_timeout(500)
    except Exception:
        pass

    # Read common metadata and structured data.
    metadata = await page.evaluate("""() => {
        const getMeta = (selector) =>
            document.querySelector(selector)?.content?.trim() || null;

        const jsonLd = [];
        document.querySelectorAll(
            'script[type="application/ld+json"]'
        ).forEach(script => {
            try {
                jsonLd.push(JSON.parse(script.textContent));
            } catch {}
        });

        return {
            title: document.querySelector("h1")?.innerText?.trim() || null,
            description: getMeta('meta[name="description"]'),
            ogTitle: getMeta('meta[property="og:title"]'),
            ogDescription: getMeta('meta[property="og:description"]'),
            jsonLd,
            bodyText: document.body?.innerText || ""
        };
    }""")

    # Search JSON-LD for product fields, when provided.
    structured = []

    def flatten_json(value):
        if isinstance(value, dict):
            structured.append(value)
            for child in value.values():
                flatten_json(child)
        elif isinstance(value, list):
            for child in value:
                flatten_json(child)

    flatten_json(metadata.get("jsonLd", []))

    product_data = next(
        (
            item for item in structured
            if "Product" in str(item.get("@type", ""))
        ),
        {},
    )

    offer = product_data.get("offers", {})
    if isinstance(offer, list):
        offer = offer[0] if offer else {}

    title = (
        clean_text(product_data.get("name"))
        or clean_text(metadata.get("title"))
        or clean_text(metadata.get("ogTitle"))
    )

    description = (
        clean_text(product_data.get("description"))
        or clean_text(metadata.get("ogDescription"))
        or clean_text(metadata.get("description"))
    )

    brand_value = product_data.get("brand")
    if isinstance(brand_value, dict):
        brand_value = brand_value.get("name")

    price_value = offer.get("price") if isinstance(offer, dict) else None
    if price_value is None:
        price_value = parse_price(metadata.get("bodyText", ""))

    currency = (
        offer.get("priceCurrency")
        if isinstance(offer, dict)
        else None
    ) or "USD"

    # Extract a few distinctive features from available description text.
    body_text = metadata.get("bodyText", "")
    searchable_text = " ".join(
        filter(None, [description, body_text])
    ).lower()

    special_details = [
        feature for feature in dict.fromkeys(SPECIAL_FEATURES)
        if re.search(r"\b" + re.escape(feature) + r"\b", searchable_text)
    ]

    # Look for material and country-of-origin information.
    materials = None
    made_in = None

    material_match = re.search(
        r"(?:Body|Composition|Materials?)\s*:\s*(.{10,300}?)(?="
        r"\s+(?:Lining|Trim|Made in|Country of origin)\s*:?"
        r"|$)",
        body_text,
        re.I,
    )
    if material_match:
        materials = clean_text(material_match.group(1))

    origin_match = re.search(
        r"\bMade in\s+([A-Za-z][A-Za-z .'-]{1,50})",
        body_text,
        re.I,
    )
    if origin_match:
        made_in = clean_text(origin_match.group(1))

    return {
        "brand": clean_text(brand_value)
            or (listing_info or {}).get("brand"),
        "name": title or (listing_info or {}).get("name"),
        "displayed_price": (
            float(price_value)
            if price_value is not None
            and str(price_value).replace(".", "", 1).isdigit()
            else (listing_info or {}).get("displayed_price")
        ),
        "currency": currency,
        "product_url": url,
        "description": description,
        "special_details": special_details or None,
        "materials": materials,
        "made_in": made_in,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


async def main():
    products_by_url = {}

    # Preserve existing records if the scraper is interrupted or rerun.
    if OUTPUT_FILE.exists():
        try:
            existing = json.loads(
                OUTPUT_FILE.read_text(encoding="utf-8")
            )
            for product in existing:
                if product.get("product_url"):
                    key = normalize_url(product["product_url"])
                    products_by_url[key] = product
        except (json.JSONDecodeError, OSError):
            print("Existing JSON could not be read; starting fresh.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(locale="en-US")
        page = await context.new_page()

        try:
            for category in CATEGORY_URLS:
                start_url = urljoin(BASE_URL, category)
                print(f"\nDiscovering: {start_url}")

                queue = [start_url]
                visited_pages = set()
                discovered_products = set()

                while queue and len(visited_pages) < MAX_PAGES_PER_CATEGORY:
                    listing_url = queue.pop(0)
                    listing_url = normalize_url(listing_url)

                    if listing_url in visited_pages:
                        continue

                    visited_pages.add(listing_url)

                    try:
                        response = await page.goto(
                            listing_url,
                            wait_until="domcontentloaded",
                            timeout=30000,
                        )
                        await check_access(page, response)

                        found, pagination = await collect_listing_links(page)
                        discovered_products.update(found)

                        for next_url in pagination:
                            if next_url not in visited_pages:
                                queue.append(next_url)

                        print(
                            f"  Pages visited: {len(visited_pages)}; "
                            f"products found: {len(discovered_products)}"
                        )

                    except Exception as error:
                        print(f"  Listing error: {error}")

                        if "security challenge" in str(error).lower():
                            raise

                print(
                    f"Total unique product URLs discovered: "
                    f"{len(discovered_products)}"
                )

                for index, product_url in enumerate(
                    sorted(discovered_products), start=1
                ):
                    if product_url in products_by_url:
                        continue

                    try:
                        print(
                            f"  Product {index}/{len(discovered_products)}: "
                            f"{product_url}"
                        )

                        product = await read_product_page(
                            page, product_url
                        )
                        products_by_url[product_url] = product

                        # Save progress after each successful product.
                        OUTPUT_FILE.write_text(
                            json.dumps(
                                list(products_by_url.values()),
                                indent=2,
                                ensure_ascii=False,
                            ),
                            encoding="utf-8",
                        )

                        await asyncio.sleep(DETAIL_DELAY_SECONDS)

                    except Exception as error:
                        print(f"  Product error: {error}")

                        if "security challenge" in str(error).lower():
                            raise

        except Exception as error:
            print(f"\nScraper stopped: {error}")

        finally:
            OUTPUT_FILE.write_text(
                json.dumps(
                    list(products_by_url.values()),
                    indent=2,
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            print(
                f"\nSaved {len(products_by_url)} total records to "
                f"{OUTPUT_FILE}"
            )
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())

