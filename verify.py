
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8000")
        await page.wait_for_load_state("networkidle")

        # Take a screenshot of the social media icons container
        element = await page.query_selector(".social-media-icons-container")
        if element:
            await element.screenshot(path="/tmp/social_icons.png")
        else:
            print("Social media icons container not found.")

        await browser.close()

asyncio.run(main())
