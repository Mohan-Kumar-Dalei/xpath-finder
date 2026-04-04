// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const http = require("http");

const fetchRoutes = require("./routes/fetchRoutes");
const { initSocket } = require("./services/socketService"); // 👈 Service import ki

const app = express();

// Limit badha di taaki bada HTML aa sake
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(morgan("dev"));
app.use("/api", fetchRoutes);

// 🤖 SOCKET INITIALIZATION
const server = http.createServer(app);
initSocket(server); // 👈 Service yahan initialize ki

// Static serve
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

// SPA fallback
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

// App ki jagah server export karna hai taaki socket chale
module.exports = server;