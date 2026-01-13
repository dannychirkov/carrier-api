import type {
  AddressService,
  ReferenceService,
  TrackingService,
  WaybillService,
  CounterpartyService,
  ContactPersonService,
  ReturnService,
} from '@shopana/novaposhta-api-client';

import type { ServerConfig } from '../config.js';

export interface NovaPoshtaClient {
  address: AddressService;
  reference: ReferenceService;
  tracking: TrackingService;
  waybill: WaybillService;
  counterparty: CounterpartyService;
  contactPerson: ContactPersonService;
  return: ReturnService;
}

export type ToolArguments = Record<string, unknown> | undefined;

export interface ToolContext {
  client: NovaPoshtaClient;
  config: ServerConfig;
}
