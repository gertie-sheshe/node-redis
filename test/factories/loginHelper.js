const sessionFactory = require('./sessionFactory');
const userFactory = require('./userFactory');

module.exports = async (page) => {

    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    // Set the values in the cookie.
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });

    // Refresh page so values are set in cookie
    await page.goto('http://localhost:3000/blogs');

    // Wait for page to completely load
    // And element to show
    await page.waitFor('a[href="/auth/logout"]');
}