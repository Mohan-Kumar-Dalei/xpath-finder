// src/utils/sanitizeUrl.js

const sanitizeUrl = (url) => {
    try {
        const parsed = new URL(url);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }

        return parsed.href;
    } catch (err) {
        throw new Error("Invalid URL");
    }
}

module.exports = sanitizeUrl;