const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');

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
    const id = '5caf06d0bff2bb270e92fb87';
    const {session, sig} = sessionFactory(id);

    // Set the values in the cookie.
    await page.setCookie({name: 'session', value: session});
    await page.setCookie({name: 'session.sig', value: sig});

    // Refresh page so values are set in cookie
    await page.goto('localhost:3000');

    // Wait for page to completely load
    // And element to show
    await page.waitFor('a[href="/auth/logout"]');

    // Check that Logout button now shows
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});