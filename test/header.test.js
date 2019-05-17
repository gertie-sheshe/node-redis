const puppeteer = require('puppeteer');
const Keygrip = require('keygrip');
const keys = require('../config/keys');

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
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };

    // Convert id to base64 session string, that can
    // be decoded by passport back into the sessionObject
    const sessionString = Buffer
    .from(JSON.stringify(sessionObject))
    .toString('base64');

    const keygrip = new Keygrip([keys.cookieKey]);

    // Sign the session
    const sig = keygrip.sign('session=' + sessionString);

    // Set the values in the cookie.
    await page.setCookie({name: 'session', value: sessionString});
    await page.setCookie({name: 'session.sig', value: sig});

    // Refresh page so values are set in cookie
    await page.goto('localhost:3000');
});