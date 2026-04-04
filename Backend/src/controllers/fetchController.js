const { getPageHTML } = require("../services/cheerioService");
const sanitizeUrl = require("../utils/sanitizeUrl");
const fs = require("fs");
const path = require("path");

const fetchSite = async (req, res) => {
    try {
        const rawUrl = req.query.url;
        if (!rawUrl) {
            return res.status(400).json({ error: "URL is required" });
        }
        const url = sanitizeUrl(rawUrl);
        const html = await getPageHTML(url);

        const filePath = path.join(__dirname, "../../scraped_temp.html");
        fs.writeFileSync(filePath, html, "utf8");
        console.log("✅ Site scraped and saved to scraped_temp.html");

        res.status(200).send(html);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: "Failed to fetch website",
        });
    }
};

module.exports = { fetchSite };