// src/controllers/fetchController.js

const { getPageHTML } = require("../services/puppeteerService");
const sanitizeUrl = require("../utils/sanitizeUrl");

const fetchSite = async (req, res) => {
    try {
        const rawUrl = req.query.url;

        if (!rawUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        const url = sanitizeUrl(rawUrl);

        const html = await getPageHTML(url);

        res.status(200).send(html);
    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            error: "Failed to fetch website",
        });
    }
};

module.exports = { fetchSite };