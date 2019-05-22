const puppeteer = require('puppeteer');
const loginPage = require('./factories/loginHelper');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    page = await browser.newPage();
    await page.goto('http://localhost:3000')
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

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'Blog Title Test');
            await page.type('.content input', 'Blog Content Test');
            await page.click('form button');
        });
        test('Submitting takes user to review screen', async () => {
            const confirmText = await page.$eval('h5', el => el.innerHTML);
            expect(confirmText).toEqual('Please confirm your entries');
        });

        test('Submitting then saving adds blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.$eval('.card-title', el => el.innerHTML);
            const content = await page.$eval('p', el => el.innerHTML);

            // console.log(title, content);

            expect(title).toEqual('Blog Title Test');
            expect(content).toEqual('Blog Content Test');
        });
    });

    // Nested describe
    describe('And using invalid input', async () => {
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