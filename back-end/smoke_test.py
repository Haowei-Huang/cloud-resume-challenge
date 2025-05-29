import re
from playwright.sync_api import Playwright, sync_playwright, Page, expect
import os
from dotenv import load_dotenv
import requests


def test_content_and_visitor_count(page: Page):
    # get the url from env file
    load_dotenv()
    test_api_url = os.getenv("TEST_API_URL")
    test_website_url = os.getenv("TEST_WEBSITE_URL")

    # get the visitor count from the api
    response = requests.post(test_api_url)
    response_json = response.json()
    api_visitor_count = response_json["item_count"]

    page.goto(test_website_url, wait_until="networkidle")
    expect(page.locator("#experience")).to_be_visible()
    expect(page.locator("#projects")).to_be_visible()
    expect(page.locator("#skills")).to_be_visible()
    expect(page.locator("#education")).to_be_visible()
    expect(page.locator("#experience")).to_contain_text("Company A")
    expect(page.locator("#experience")).to_contain_text("Company B")
    expect(page.locator("#skills")).to_contain_text("Java")
    expect(page.locator("#skills")).to_contain_text("MongoDB")
    expect(page.locator("#education")).to_contain_text("A University")
    expect(page.locator("#education")).to_contain_text("B University")
    expect(page.get_by_role("main")).to_contain_text("You Name")

    page_visitor_count = page.get_by_test_id("visitor-count")
    expect(page_visitor_count).to_have_text("# " + str(api_visitor_count))
