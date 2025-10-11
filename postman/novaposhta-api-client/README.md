## Nova Poshta API — Postman Collections

A compact, durable Postman setup for exploring and testing the Nova Poshta API. This README focuses on concepts and workflows rather than file names or other details that frequently change.

### What you get
- Address discovery (areas, regions, cities, streets, warehouses)
- Online fuzzy search (settlements and streets, with GPS for streets)
- Reference data (cargo types, packaging, service types, etc.)
- Built‑in examples and lightweight tests to validate responses

### Requirements
- Postman (latest desktop version recommended)
- API key is only needed for reference-data requests; address discovery works without it

### Quick start
1. Open Postman and import the environment plus any collections from this folder.
2. Select the imported environment in the top‑right corner of Postman.
3. If you plan to call reference endpoints, set your API key in the environment.
4. Pick any request from a collection and click Send.

Tip: Collections are self‑contained and can be imported independently. Start with address discovery, then expand to online search or reference data as needed.

### Authentication
- Address discovery: no API key required
- Reference service: API key required
- Keep the key in the chosen Postman environment (never commit secrets)

### Request shape (unified)
All Nova Poshta requests share the same envelope:

```json
{
  "modelName": "<ServiceName>",
  "calledMethod": "<MethodName>",
  "methodProperties": { /* parameters */ }
}
```

Examples of typical calls (placeholders only):

```json
{
  "modelName": "Address",
  "calledMethod": "getCities",
  "methodProperties": {
    "FindByString": "<city name>",
    "Page": "<page>",
    "Limit": "<limit>"
  }
}
```

```json
{
  "modelName": "Address",
  "calledMethod": "getWarehouses",
  "methodProperties": {
    "CityRef": "<city ref>",
    "FindByString": "<street or number>",
    "TypeOfWarehouseRef": "<type ref>",
    "Page": "<page>",
    "Limit": "<limit>"
  }
}
```

```json
{
  "modelName": "Address",
  "calledMethod": "searchSettlements",
  "methodProperties": {
    "CityName": "<settlement name>",
    "Page": "<page>",
    "Limit": "<limit>"
  }
}
```

```json
{
  "modelName": "Address",
  "calledMethod": "searchSettlementStreets",
  "methodProperties": {
    "SettlementRef": "<settlement ref>",
    "StreetName": "<street name>",
    "Limit": "<limit>"
  }
}
```

### Common workflows
- City‑based discovery (known cities)
  1) getCities → CityRef
  2) getWarehouses (with CityRef)
  3) getStreet (with CityRef)

- Universal search (any location, plus GPS for streets)
  1) searchSettlements → SettlementRef + deliveryCity (CityRef)
  2) getWarehouses (with deliveryCity)
  3) searchSettlementStreets (with SettlementRef) → GPS for mapping

- Warehouse‑first (delivery points focus)
  1) getCities → CityRef
  2) getWarehouseTypes (optional)
  3) getWarehouses (filter by type and/or text)

### Pagination and limits
- Address endpoints typically support Page and Limit
- Online street search uses Limit only (no Page)
- Prefer conservative limits first; increase as needed to reduce noise

### Built‑in tests
Requests include lightweight Postman tests that:
- Assert HTTP 200
- Check presence of essential fields
- Perform basic structure validation

Tests run automatically after each request. You can extend or disable them per request.

### Tips and good practices
- Separate environments for production and local experiments
- Keep `BASE_URL` and `API_KEY` (if needed) in environment variables
- Avoid hard‑coding refs in collections; use variables or examples when possible
- Use online search when you need GPS coordinates or must support small settlements
- Use city‑based discovery for known major cities and faster lookups

### Troubleshooting
- 401/Forbidden on reference data: ensure API key is present and valid in the active environment
- Empty results: check spelling, paging, limits, and the required refs (CityRef/SettlementRef)
- Language fields differ by endpoint; use what the API returns for your UI needs
- Rate‑limits or transient failures: retry with backoff and smaller limits

### Extending the collections
- Duplicate a request and adjust `calledMethod` and `methodProperties`
- Keep examples minimal and generic (no hard‑coded secrets or long refs)
- Add or refine Postman tests near the requests you create

### Learn more
- Official Nova Poshta API documentation: https://developers.novaposhta.ua/

This folder is designed to remain useful even as specific endpoints evolve. Focus on the patterns above, and use the examples as templates rather than fixed reference data.
