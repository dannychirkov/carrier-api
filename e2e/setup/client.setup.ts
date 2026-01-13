import {
  createClient,
  AddressService,
  ReferenceService,
  TrackingService,
  WaybillService,
  ScanSheetService,
} from '@shopana/novaposhta-api-client';
import { createFetchHttpTransport } from '@shopana/novaposhta-transport-fetch';

const apiKey = process.env.NP_API_KEY || '';

export const client = createClient({
  transport: createFetchHttpTransport(),
  baseUrl: 'https://api.novaposhta.ua/v2.0/json/',
  apiKey,
})
  .use(new AddressService())
  .use(new ReferenceService())
  .use(new TrackingService())
  .use(new WaybillService())
  .use(new ScanSheetService());
