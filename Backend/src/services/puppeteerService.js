// src/services/puppeteerService.js

const puppeteer = require("puppeteer");

const getPageHTML = async (url) => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000,
        });
        // ⏳ wait manually
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Fix relative paths
        await page.evaluate(() => {
            const base = document.createElement("base");
            base.href = window.location.href;
            document.head.appendChild(base);
        });

        const html = await page.content();

        return html;
    } catch (err) {
        throw err;
    } finally {
        await browser.close();
    }
}

module.exports = { getPageHTML };