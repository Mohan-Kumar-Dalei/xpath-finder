// src/services/cheerioService.js

const axios = require("axios");
const cheerio = require("cheerio");

const getPageHTML = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            },
            timeout: 30000,
        });

        const $ = cheerio.load(data);

        // Fix relative URLs (same as <base> tag in puppeteer)
        const baseUrl = new URL(url).origin;

        $("a, img, link, script").each((_, el) => {
            const attr =
                el.name === "a" || el.name === "link"
                    ? "href"
                    : el.name === "img" || el.name === "script"
                        ? "src"
                        : null;

            if (attr) {
                const value = $(el).attr(attr);
                if (value && !value.startsWith("http")) {
                    $(el).attr(attr, baseUrl + value);
                }
            }
        });

        const html = $.html();
        return html;

    } catch (err) {
        console.error("Cheerio error:", err.message);
        throw err;
    }
};

module.exports = { getPageHTML };