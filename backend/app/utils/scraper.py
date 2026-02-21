from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from typing import Optional

EXCLUDED_RESOURCE_TYPES = {"image", "media", "font", "stylesheet"}

async def fetch_and_parse(url: str) -> Optional[BeautifulSoup]:
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--single-process"
            ]
        )
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            locale="pt-BR"
        )
        
        page = await context.new_page()

        await page.route(
            "**/*",
            lambda route: route.abort() if route.request.resource_type in EXCLUDED_RESOURCE_TYPES else route.continue_()
        )

        try:
            response = await page.goto(url, wait_until="load", timeout=10000)
            
            if not response or response.status >= 400:
                print(f"Status inválido: {response.status if response else 'Sem resposta'}")
                return None
                
            html_content = await page.content()
            return BeautifulSoup(html_content, 'lxml')
        except Exception as e:
            print(f"Falha no Playwright: {e}")
            return None
        finally:
            await browser.close()