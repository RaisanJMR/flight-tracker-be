const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataPath = path.join(__dirname, "..", "airports", "airports.json");
let airports = [];

try {
  airports = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  console.log(`Loaded ${airports.length} airports`);
} catch (err) {
  console.error("Failed to load airports.json:", err.message);
  console.error("Run: node scripts/convert-airports.js");
}

router.get("/", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const search = (req.query.search || req.query.name || "").trim().toLowerCase();

  let filtered = airports;

  if (search) {
    filtered = airports.filter((airport) =>
      (airport.name || "").toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json({
    data,
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
    search: search || null,
  });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const airport = airports.find((a) => a.id === id);

  if (!airport) {
    return res.status(404).json({ error: "Airport not found" });
  }

  res.json(airport);
});

module.exports = router;
