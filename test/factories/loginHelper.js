module.exports = async (page, session, sig) => {
    // Set the values in the cookie.
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });

    // Refresh page so values are set in cookie
    await page.goto('localhost:3000');

    // Wait for page to completely load
    // And element to show
    await page.waitFor('a[href="/auth/logout"]');
}