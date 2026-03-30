// src/routes/fetchRoutes.js

const express = require("express");
const router = express.Router();

const { fetchSite } = require("../controllers/fetchController");

router.get("/fetch", fetchSite);

module.exports = router;