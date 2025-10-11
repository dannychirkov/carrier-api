// code and comments in English
import { createClient, ClientContext } from '@shopana/novaposhta-api-client';
import { createFetchHttpTransport } from '@shopana/novaposhta-transport-fetch';
import { AddressService } from '@shopana/novaposhta-api-client';
import { ReferenceService } from '@shopana/novaposhta-api-client';
import { TrackingService } from '@shopana/novaposhta-api-client';
import { WaybillService } from '@shopana/novaposhta-api-client';

/**
 * Get API key from environment
 */
export const getApiKey = (): string => {
  return process.env.NOVA_POSHTA_API_KEY || '';
};

/**
 * Create Nova Poshta API client for testing
 */
export const createTestClient = () => {
  const apiKey = getApiKey();
  const transport = createFetchHttpTransport();
  const baseUrl = 'https://api.novaposhta.ua/v2.0/json/';

  const ctx: ClientContext = {
    transport,
    baseUrl,
    apiKey,
  };

  const client = createClient(ctx)
    .use(new AddressService())
    .use(new ReferenceService())
    .use(new TrackingService())
    .use(new WaybillService());

  return client;
};

/**
 * Export client instance for tests
 */
export const client = createTestClient();
