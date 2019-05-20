const puppeteer = require('puppeteer');
const loginPage = require('./factories/loginHelper');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Header has correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('Clicking Login starts OAuth flow', async () => {
    await page.click('.right a');

    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/)
});

test('When signed in, show logout button', async () => {
    // Login logic for Chromium/puppeteer
    await loginPage(page);
    // Check that Logout button now shows
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});