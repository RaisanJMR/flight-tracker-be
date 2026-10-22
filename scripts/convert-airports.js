const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "airports", "airports.csv.html");
const outPath = path.join(__dirname, "..", "airports", "airports.json");

const headers = [
  "id",
  "ident",
  "type",
  "name",
  "latitude_deg",
  "longitude_deg",
  "elevation_ft",
  "continent",
  "iso_country",
  "iso_region",
  "municipality",
  "scheduled_service",
  "icao_code",
  "iata_code",
  "gps_code",
  "local_code",
  "home_link",
  "wikipedia_link",
  "keywords",
];

const numericFields = new Set([
  "id",
  "latitude_deg",
  "longitude_deg",
  "elevation_ft",
]);

function decodeHtml(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

console.log("Reading HTML...");
const html = fs.readFileSync(htmlPath, "utf8");

const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g;

const rows = [];
let skipped = 0;
let match;

while ((match = rowRe.exec(html)) !== null) {
  const cells = [];
  let cellMatch;
  cellRe.lastIndex = 0;

  while ((cellMatch = cellRe.exec(match[1])) !== null) {
    cells.push(decodeHtml(cellMatch[1]));
  }

  if (cells.length < 2) continue;

  const firstData = cells[1];
  if (
    firstData === "id" ||
    firstData === "" ||
    /^[A-Z]$/.test(firstData)
  ) {
    skipped += 1;
    continue;
  }

  const obj = {};
  for (let i = 0; i < headers.length; i += 1) {
    const key = headers[i];
    const raw = cells[i + 1] ?? "";
    if (numericFields.has(key) && raw !== "") {
      const num = Number(raw);
      obj[key] = Number.isNaN(num) ? raw : num;
    } else {
      obj[key] = raw;
    }
  }
  rows.push(obj);
}

fs.writeFileSync(outPath, JSON.stringify(rows));
const sizeMb = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
console.log(`Converted ${rows.length} airports (skipped ${skipped})`);
console.log(`Wrote ${outPath} (${sizeMb} MB)`);
console.log("Sample:", JSON.stringify(rows[0], null, 2));
