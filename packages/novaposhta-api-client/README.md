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
  CounterpartyService,
  ContactPersonService,
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
  .use(new CounterpartyService())
  .use(new ContactPersonService())
  .use(new ReferenceService())
  .use(new TrackingService())
  .use(new WaybillService());

// Namespaced API
const cities = await client.address.getCities({});
const cargoTypes = await client.reference.getCargoTypes();
const tracked = await client.tracking.trackDocument('20400048799000');
```

## Counterparty Management

### Get Counterparties

```ts
const senders = await client.counterparty.getCounterparties({
  counterpartyProperty: 'Sender',
  page: 1,
});
```

### Create Private Person Counterparty

```ts
const newRecipient = await client.counterparty.save({
  counterpartyType: 'PrivatePerson',
  counterpartyProperty: 'Recipient',
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '380501234567',
  email: 'ivan@example.com',
  cityRef: 'city-ref',
});
```

### Create Organization Counterparty

```ts
const organization = await client.counterparty.save({
  counterpartyType: 'Organization',
  counterpartyProperty: 'Sender',
  phone: '380671234567',
  email: 'office@company.com',
  ownershipForm: 'ТОВ',    // ownership form ref
  edrpou: '12345678',      // tax code
  // Optional contact person
  firstName: 'Марія',
  lastName: 'Менеджер',
  cityRef: 'city-ref',
});
```

### Get Counterparty Details

```ts
// Get addresses
const addresses = await client.counterparty.getCounterpartyAddresses({
  ref: 'counterparty-ref',
  page: 1,
});

// Get contact persons
const contacts = await client.counterparty.getCounterpartyContactPersons({
  ref: 'counterparty-ref',
});

// Get available options (payment permissions, delays, etc.)
const options = await client.counterparty.getCounterpartyOptions({
  ref: 'counterparty-ref',
});
```

## Contact Person Management

### Create Contact Person

```ts
const contact = await client.contactPerson.save({
  counterpartyRef: 'counterparty-ref',
  firstName: 'Марія',
  lastName: 'Коваленко',
  phone: '380671234567',
});
```

## Address Management

### Search and Create Address

```ts
// Search for a settlement
const settlements = await client.address.searchSettlements({
  cityName: 'Київ',
  page: 1,
  limit: 10,
});
const settlementRef = settlements.data[0].Ref;

// Search for a street
const streets = await client.address.searchSettlementStreets({
  streetName: 'Хрещатик',
  settlementRef: settlementRef,
  limit: 10,
});
const streetRef = streets.data[0].Ref;

// Create address
const address = await client.address.save({
  counterpartyRef: 'counterparty-ref',
  streetRef: streetRef,
  buildingNumber: '10',
  flat: '5',
  note: 'Door code: 1234',
});
```

### Update and Delete Address

```ts
// Update address
await client.address.update({
  ref: 'address-ref',
  counterpartyRef: 'counterparty-ref',
  streetRef: 'new-street-ref',
  buildingNumber: '15',
  flat: '10',
});

// Delete address
await client.address.delete({
  ref: 'address-ref',
});
```

## Reference Data

### Get Reference Dictionaries

```ts
// Get payer types (Sender/Recipient/ThirdPerson)
const payerTypes = await client.reference.getTypesOfPayers();

// Get payment forms (Cash/NonCash)
const paymentForms = await client.reference.getPaymentForms();

// Get counterparty types (PrivatePerson/Organization)
const counterpartyTypes = await client.reference.getTypesOfCounterparties();

// Get cargo types
const cargoTypes = await client.reference.getCargoTypes();

// Get service types (warehouse-warehouse, door-warehouse, etc.)
const serviceTypes = await client.reference.getServiceTypes();
```

## Complete Waybill Creation Workflow

This example shows the complete process of creating a recipient and waybill:

```ts
// 1. Create recipient counterparty
const recipient = await client.counterparty.save({
  counterpartyType: 'PrivatePerson',
  counterpartyProperty: 'Recipient',
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '380501234567',
  email: 'ivan@example.com',
});

const recipientRef = recipient.data[0].Ref;

// 2. Get contact person (created automatically with counterparty)
const recipientContact = recipient.data[0].ContactPerson.data[0].Ref;

// 3. Search for recipient city
const cities = await client.address.searchSettlements({
  cityName: 'Київ',
  page: 1,
  limit: 1,
});
const recipientCityRef = cities.data[0].DeliveryCity;

// 4. Search for warehouse in recipient city
const warehouses = await client.address.getWarehouses({
  cityRef: recipientCityRef,
  limit: 1,
});
const recipientWarehouseRef = warehouses.data[0].Ref;

// 5. Create waybill
const waybill = await client.waybill.create({
  payerType: 'Sender',
  paymentMethod: 'Cash',
  dateTime: '25.12.2024',
  cargoType: 'Parcel',
  weight: 1.5,
  serviceType: 'WarehouseWarehouse',
  seatsAmount: 1,
  description: 'Test package',
  cost: 1000,
  citySender: 'sender-city-ref',         // your sender city
  sender: 'sender-counterparty-ref',     // your sender counterparty
  senderAddress: 'sender-warehouse-ref', // your sender warehouse
  contactSender: 'sender-contact-ref',   // your sender contact
  sendersPhone: '380671234567',
  cityRecipient: recipientCityRef,
  recipient: recipientRef,
  recipientAddress: recipientWarehouseRef,
  contactRecipient: recipientContact,
  recipientsPhone: '380501234567',
});

console.log('Waybill created:', waybill.data[0].IntDocNumber);
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
