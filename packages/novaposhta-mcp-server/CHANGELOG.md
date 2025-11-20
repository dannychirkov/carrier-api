# Changelog

All notable changes to the Nova Poshta MCP Server will be documented in this file.

## [0.0.1-alpha.1] - 2025-11-20

### Fixed
- Fixed excessive token consumption in address tools by removing full API response from structuredContent
- Address search tools now return only preview data (first 5 items) instead of complete dataset
- Reduced token usage from ~2.4M to ~200-500 tokens per address search request

## [0.0.1-alpha.0] - 2025-11-20

### Added
- Initial alpha release of Nova Poshta MCP Server
- Document tracking functionality (single and multiple documents)
- Document movement history retrieval
- Document list retrieval by date range
- Address search capabilities (cities, settlements, streets, warehouses)
- Waybill operations (create, update, delete, calculate cost)
- Delivery date estimation
- Reference data access (cargo types, service types, payment methods, pallets, time intervals, ownership forms)
- Message decoding functionality
- HTTP and STDIO transport support
- Comprehensive error handling and validation
