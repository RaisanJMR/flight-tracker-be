# Flight Tracker API

Node.js / Express backend that serves airport data as JSON, with pagination and name search.

## Setup

```bash
npm install
npm start
```

For local development with auto-reload:

```bash
npm run dev
```

Server runs at `http://localhost:3000` (or `PORT` if set).

### Regenerate airport data

Airport records are loaded from `airports/airports.json`. To rebuild that file from the HTML export:

```bash
npm run convert:airports
```

---

## APIs

Base URL: `http://localhost:3000`

### Home page

```
GET /
```

Serves the project home page (`public/index.html`) with setup, API docs, and schema details.

---

### Health check

```
GET /api/health
```

**Response** `200`

```json
{
  "message": "Flight Tracker API is running",
  "status": "ok"
}
```

---

### List airports

```
GET /api/airports
```

Returns a paginated list of airports. Optionally filter by airport name.

#### Query parameters

| Parameter | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `page`    | number | `1`     | Page number (minimum `1`) |
| `limit`   | number | `20`    | Items per page (minimum `1`, maximum `100`) |
| `search`  | string | —       | Case-insensitive partial match on airport `name` |
| `name`    | string | —       | Alias for `search` |

#### Response `200`

```json
{
  "data": [
    {
      "id": 2434,
      "ident": "EGLL",
      "type": "large_airport",
      "name": "London Heathrow Airport",
      "latitude_deg": 51.470748,
      "longitude_deg": -0.459909,
      "elevation_ft": 83,
      "continent": "EU",
      "iso_country": "GB",
      "iso_region": "GB-ENG",
      "municipality": "London",
      "scheduled_service": "yes",
      "icao_code": "EGLL",
      "iata_code": "LHR",
      "gps_code": "EGLL",
      "local_code": "",
      "home_link": "http://www.heathrow.com/",
      "wikipedia_link": "https://en.wikipedia.org/wiki/Heathrow_Airport",
      "keywords": "LON, Londres"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "search": "heathrow"
}
```

| Field | Description |
|-------|-------------|
| `data` | Array of airport objects for the current page |
| `pagination.page` | Current page |
| `pagination.limit` | Page size |
| `pagination.total` | Total matching airports |
| `pagination.totalPages` | Total pages |
| `pagination.hasNext` | Whether a next page exists |
| `pagination.hasPrev` | Whether a previous page exists |
| `search` | Applied search term, or `null` if none |

#### Examples

```bash
# First page, 20 items
curl "http://localhost:3000/api/airports"

# Page 2, 10 items
curl "http://localhost:3000/api/airports?page=2&limit=10"

# Search by name
curl "http://localhost:3000/api/airports?search=Heathrow"

# Search + pagination
curl "http://localhost:3000/api/airports?name=Delhi&page=1&limit=5"
```

---

### Get airport by ID

```
GET /api/airports/:id
```

Returns a single airport by numeric `id`.

#### Path parameters

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | number | Airport ID |

#### Response `200`

```json
{
  "id": 2434,
  "ident": "EGLL",
  "type": "large_airport",
  "name": "London Heathrow Airport",
  "latitude_deg": 51.470748,
  "longitude_deg": -0.459909,
  "elevation_ft": 83,
  "continent": "EU",
  "iso_country": "GB",
  "iso_region": "GB-ENG",
  "municipality": "London",
  "scheduled_service": "yes",
  "icao_code": "EGLL",
  "iata_code": "LHR",
  "gps_code": "EGLL",
  "local_code": "",
  "home_link": "http://www.heathrow.com/",
  "wikipedia_link": "https://en.wikipedia.org/wiki/Heathrow_Airport",
  "keywords": "LON, Londres"
}
```

#### Response `404`

```json
{
  "error": "Airport not found"
}
```

#### Example

```bash
curl "http://localhost:3000/api/airports/2434"
```

---

## Airport object fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique airport ID |
| `ident` | string | Airport identifier |
| `type` | string | e.g. `large_airport`, `small_airport`, `heliport` |
| `name` | string | Airport name |
| `latitude_deg` | number | Latitude |
| `longitude_deg` | number | Longitude |
| `elevation_ft` | number | Elevation in feet |
| `continent` | string | Continent code |
| `iso_country` | string | ISO country code |
| `iso_region` | string | ISO region code |
| `municipality` | string | City / municipality |
| `scheduled_service` | string | `yes` or `no` |
| `icao_code` | string | ICAO code |
| `iata_code` | string | IATA code |
| `gps_code` | string | GPS code |
| `local_code` | string | Local code |
| `home_link` | string | Official website URL |
| `wikipedia_link` | string | Wikipedia URL |
| `keywords` | string | Alternate names / keywords |
