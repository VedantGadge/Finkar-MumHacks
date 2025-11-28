# FinKar Backend

Backend proxy server for the FinKar stock analysis application.

## Purpose

This server acts as a proxy between the React frontend and the HuggingFace API to handle CORS (Cross-Origin Resource Sharing) restrictions.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Endpoints

### GET /api/tickers

Fetches the list of available stock tickers.

**Response:**

```json
{
  "count": 50,
  "tickers": ["RELIANCE.NS", "TCS.NS", ...]
}
```

### POST /api/case-study

Generates a case study for a given stock ticker.

**Request Body:**

```json
{
  "ticker": "KOTAKBANK.NS",
  "company_name": "Kotak Mahindra Bank Limited",
  "use_finbert": false,
  "use_groq": false
}
```

**Response:**
Full case study JSON object

## Environment Variables

- `PORT`: Server port (default: 5000)
