# @shopana/novaposhta-api-client

A lightweight type-safe Nova Poshta API client with plugin architecture. Transport is injected externally, services are connected as plugins and available in namespaces `client.address`, `client.reference`, `client.tracking`, `client.waybill`.

## Installation

```bash
# with external fetch-based transport (recommended)
yarn add @shopana/novaposhta-api-client @shopana/novaposhta-transport-fetch
# or
npm i @shopana/novaposhta-api-client @shopana/novaposhta-transport-fetch
```

## Quick Start

```ts
// code and comments in English
import {
  createClient,
  AddressService,
  ReferenceService,
  TrackingService,
  WaybillService,
} from '@shopana/novaposhta-api-client';
import { createFetchHttpTransport } from '@shopana/novaposhta-transport-fetch';

const client = createClient({
  transport: createFetchHttpTransport(),           // external transport (HTTP POST JSON)
  baseUrl: 'https://api.novaposhta.ua/v2.0/json/', // NP JSON endpoint
  // apiKey is optional; it will be sent only if provided
  apiKey: process.env.NP_API_KEY,
})
  .use(new AddressService())
  .use(new ReferenceService())
  .use(new TrackingService())
  .use(new WaybillService());

// Namespaced API
const cities = await client.address.getCities({});
const cargoTypes = await client.reference.getCargoTypes();
const tracked = await client.tracking.trackDocument('20400048799000');
```

## Custom Transport (if not using the bundled one)

```ts
// code and comments in English
// Minimal HTTP POST JSON transport using fetch
export function createSimpleFetchTransport() {
  return async ({ url, body, signal }: { url: string; body: unknown; signal?: AbortSignal }) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    return { status: res.status, data: await res.json() };
  };
}

const client = createClient({
  transport: createSimpleFetchTransport(),
  baseUrl: 'https://api.novaposhta.ua/v2.0/json/',
  // apiKey is optional
});
```

## Features

- Plugin architecture: connect only the services you need (`.use(new AddressService())`, etc.)
- Namespaced API: calls like `client.address.*`, `client.reference.*`, `client.tracking.*`, `client.waybill.*`
- External transport: client is independent of transport implementation; expects HTTP POST JSON
- Tree-shaking: only used services will be included in the bundle
- Type-safe: all inputs/outputs are strictly typed (TypeScript)
- API key is sent only if provided during initialization (`apiKey` is optional)

## Supported Environment

- Node.js and browsers
- Only requires the ability to make HTTP POST JSON requests

Additional examples (Node https-transport, tests) can be found in `packages/novaposhta-api-client/examples/`.
