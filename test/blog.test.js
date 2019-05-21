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

describe('When logged in', async () => {
    beforeEach(async () => {
        await loginPage(page);
        await page.click('a.btn-floating');
    });

    test('Can see blog create form', async () => {
        const label = await page.$eval('form label', el => el.innerHTML);
        expect(label).toEqual('Blog Title');
    });

    // Nested describe
    describe('And using invaid input', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('the form shows an error message', async () => {
            const titleError = await page.$eval('.title .red-text', el => el.innerHTML);
            const contentError = await page.$eval('.content .red-text', el => el.innerHTML);

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});