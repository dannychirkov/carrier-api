# Changelog

All notable changes to the Carrier API monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1-alpha.5] - 2025-11-20

### Added
- Optional `system` field to API requests (type: `'DevCentre'`)
- Support for passing `system` parameter in `ClientContext` configuration
- Export of `System` type from base types

### Changed
- Updated `NovaPoshtaRequest` interface to include optional `system` field
- Updated `ClientContext` interface to include optional `system` field
- Enhanced `toHttpTransport` to handle `system` field from config or request

## [0.0.1-alpha.4] - 2025-11-20

### Changed
- Previous alpha release

## [0.0.1-alpha.3] - 2025-11-20

### Changed
- Previous alpha release

## [0.0.1-alpha.2] - 2025-11-20

### Changed
- Previous alpha release

## [0.0.1-alpha.1] - 2025-11-20

### Changed
- Previous alpha release

## [0.0.1-alpha.0] - 2025-11-19

### Overview

Initial alpha release of the Nova Poshta API client library. This release includes a fully-featured API client with plugin architecture, comprehensive TypeScript support, and transport-agnostic design.

### Packages

#### @shopana/novaposhta-api-client@0.0.1-alpha.0

**Features:**
- Plugin-based architecture with 4 service modules
- Complete Nova Poshta API v2.0 coverage
- Full TypeScript support with comprehensive types and enums
- 60 unit tests (100% pass rate)
- Tree-shakeable design for optimal bundle size

**Services:**
- AddressService (6 methods)
- ReferenceService (12 methods)
- TrackingService (12 methods + helpers)
- WaybillService (12 methods)

See [packages/novaposhta-api-client/CHANGELOG.md](./packages/novaposhta-api-client/CHANGELOG.md) for detailed changes.

#### @shopana/novaposhta-transport-fetch@0.0.1-alpha.0

**Features:**
- Fetch-based HTTP transport implementation
- Cross-platform support (Node.js + Browser)
- Minimal size: 2.3 kB packed
- AbortSignal support for cancellation

See [packages/novaposhta-transport-fetch/CHANGELOG.md](./packages/novaposhta-transport-fetch/CHANGELOG.md) for detailed changes.

### Testing Infrastructure

**Added:**
- Unit tests for all services (60 tests, 100% pass)
- Integration tests for real API (77 tests)
- Test helpers for conditional test execution
- Automatic skip for tests requiring API key
- Mock transport utilities

**Integration Tests:**
- 54 tests pass without API key
- 23 tests skipped (require API key or have outdated test data)
- Comprehensive coverage of all API endpoints

### Development Tools

**Added:**
- TypeScript configuration for monorepo
- Jest configuration for unit and integration tests
- ESLint and Prettier setup
- Rollup build configuration
- Coverage reporting

### Documentation

**Added:**
- README files for all packages
- Integration test documentation
- Usage examples for all services
- TypeScript type documentation
- Contributing guidelines

### Repository Structure

```
carrier-api/
├── packages/
│   ├── novaposhta-api-client/     # Main API client
│   └── novaposhta-transport-fetch/ # Fetch transport
├── e2e/                            # Integration tests
├── LICENSE                         # Apache 2.0
└── README.md                       # Main documentation
```

### Breaking Changes

None (initial release)

### Known Issues

- Some integration tests skip due to outdated test data UUIDs
- API pagination doesn't work as expected for some endpoints (Nova Poshta API limitation)
- Document tracking tests require real document numbers

### Migration Guide

Not applicable (initial release)

### Upgrade Notes

Not applicable (initial release)

## Installation

```bash
# Install both packages
npm install @shopana/novaposhta-api-client@alpha @shopana/novaposhta-transport-fetch@alpha

# Or with yarn
yarn add @shopana/novaposhta-api-client@alpha @shopana/novaposhta-transport-fetch@alpha
```

## Quick Start

```typescript
import { createClient, AddressService, ReferenceService } from '@shopana/novaposhta-api-client';
import { createFetchHttpTransport } from '@shopana/novaposhta-transport-fetch';

const client = createClient({
  transport: createFetchHttpTransport(),
  baseUrl: 'https://api.novaposhta.ua/v2.0/json/',
  apiKey: process.env.NP_API_KEY,
})
  .use(new AddressService())
  .use(new ReferenceService());

// Use the API
const cities = await client.address.getCities({ findByString: 'Київ' });
const cargoTypes = await client.reference.getCargoTypes();
```

[Unreleased]: https://github.com/shopanaio/carrier-api/compare/v0.0.1-alpha.0...HEAD
[0.0.1-alpha.0]: https://github.com/shopanaio/carrier-api/releases/tag/v0.0.1-alpha.0
