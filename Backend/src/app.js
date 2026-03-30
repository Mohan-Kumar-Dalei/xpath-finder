// src/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const fetchRoutes = require("./routes/fetchRoutes");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173", // dev
        "https://your-frontend.vercel.app", // production
    ],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", fetchRoutes);
// static serve
app.use(
    express.static(path.join(__dirname, "../../frontend/dist"))
);
// SPA fallback
app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../../frontend/dist/index.html")
    );
});
module.exports = app;