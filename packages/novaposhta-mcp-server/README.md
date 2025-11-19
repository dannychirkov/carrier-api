# @shopana/novaposhta-mcp-server

Model Context Protocol (MCP) server that exposes Nova Poshta postal services to AI assistants via Nova Poshta API.

## Features

- Tracking tools (single/multi waybill, status history)
- Address search (settlements, cities, warehouses)
- Waybill operations (calculate, create, update, delete)
- Reference data access (services, cargo types, payer types, etc.)

## Quick start

```bash
# Install dependencies
yarn install

# Build the MCP server
yarn workspace @shopana/novaposhta-mcp-server build

# Run in dev mode (stdio transport)
NOVA_POSHTA_API_KEY=your_key yarn workspace @shopana/novaposhta-mcp-server dev
```

Required environment variables:

| Name | Description |
|------|-------------|
| `NOVA_POSHTA_API_KEY` | API key from Nova Poshta cabinet |
| `NOVA_POSHTA_BASE_URL` | Optional API base URL (defaults to v2.0) |
| `LOG_LEVEL` | `debug`, `info`, `warn`, or `error` |

## Available tools

- Tracking: `track_document`, `track_multiple_documents`, `get_document_movement`, `get_document_list`
- Address: `address_search_cities`, `address_search_settlements`, `address_search_streets`, `address_get_warehouses`
- Waybill: `waybill_calculate_cost`, `waybill_create`, `waybill_update`, `waybill_delete`, `waybill_get_delivery_date`
- Reference: `reference_get_cargo_types`, `reference_get_service_types`, `reference_get_payment_methods`, `reference_get_pallet_types`, `reference_get_time_intervals`, `reference_get_ownership_forms`, `reference_decode_message`

## MCP integration

- `examples/claude-desktop-config.json` – ready-to-use Claude Desktop snippet
- `examples/usage-examples.ts` – programmatic usage example
