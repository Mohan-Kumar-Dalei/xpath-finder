const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const initSocket = (server) => {
    const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

    io.on("connection", (socket) => {
        socket.on("fetch_ai_xpath", async (data) => {
            try {
                // 🔥 NAYA CHANGE: Frontend se refData ke sath apiKey bhi receive karo
                const { refData, apiKey } = data;

                // Agar frontend ne API key nahi bheji, toh turant error emit kar do
                if (!apiKey || apiKey.trim() === "") {
                    return socket.emit("ai_xpath_generated", { success: false, error: "Please provide your Google Gemini API Key! 🔑" });
                }

                const filePath = path.join(__dirname, "../../scraped_temp.html");
                if (!fs.existsSync(filePath)) {
                    return socket.emit("ai_xpath_generated", { success: false, error: "No site loaded yet on server!" });
                }
                const savedHtml = fs.readFileSync(filePath, "utf8");

                const $ = cheerio.load(savedHtml);
                $('script, style, svg, noscript, meta, link, iframe').remove();
                const cleanHtml = $('body').html() || "";

                // 🔥 NAYA CHANGE: User ki API key ke sath GoogleGenerativeAI ko initialize karo
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

                // 🔥 Prompt ekdum same hai
                const prompt = `
                You are a precise Web Scraping Expert. Find the element matching this reference (URL, Title, or Class): "${refData}"

                CRITICAL INSTRUCTIONS:
                1. PREFER ATTRIBUTES OVER TEXT: Always prioritize matching the element using @class, @href, @src, or @id. Use text matching (contains(text(), ...)) ONLY if attributes are generic or missing.
                2. CLOSEST MEANINGFUL PARENT ONLY: Do NOT go to the top of the DOM. Find the absolute closest parent (just 1 or 2 levels up) that has a unique class or id, and trace down.
                   Example of GOOD output: //div[contains(@class,"blog_post")]/div/a
                   Example of BAD output: //body/div/section/div/div/a
                3. Generate 3 to 5 different XPaths for this exact element based on these rules.
                4. Output MUST be a valid JSON array of strings ONLY. No markdown formatting like \`\`\`json. Just the raw array.

                HTML:
                ${cleanHtml.substring(0, 60000)}
                `;

                const result = await model.generateContent(prompt);
                let textResponse = result.response.text().trim();

                textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
                const xpathArray = JSON.parse(textResponse);

                socket.emit("ai_xpath_generated", { success: true, xpaths: xpathArray });

            } catch (error) {
                console.error("AI Error:", error);

                // Naya Check: Agar API key galat hogi toh specific error message bhej sakte ho
                if (error.message && error.message.includes("API key not valid")) {
                    socket.emit("ai_xpath_generated", { success: false, error: "Invalid API Key! Please check your Gemini API key." });
                } else {
                    socket.emit("ai_xpath_generated", { success: false, error: "AI failed to parse element." });
                }
            }
        });
    });

    return io;
};

module.exports = { initSocket };