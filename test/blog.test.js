const puppeteer = require('puppeteer');
const loginPage = require('./factories/loginHelper');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    await page.goto('localhost:3000')
});

afterEach(async () => {
    await browser.close();
});

test('When logged in, can see blog create form', async () => {
    await loginPage(page);
    await page.click('a.btn-floating');
    const label = await page.$eval('form label', el => el.innerHTML);

    expect(label).toEqual('Blog Title');
});