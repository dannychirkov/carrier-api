import type { AddressService, ReferenceService, TrackingService, WaybillService } from '@shopana/novaposhta-api-client';

import type { ServerConfig } from '../config.js';

export interface NovaPoshtaClient {
  address: AddressService;
  reference: ReferenceService;
  tracking: TrackingService;
  waybill: WaybillService;
}

export type ToolArguments = Record<string, unknown> | undefined;

export interface ToolContext {
  client: NovaPoshtaClient;
  config: ServerConfig;
}
