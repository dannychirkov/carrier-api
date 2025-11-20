import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getAddressTools, handleAddressTool } from '../../src/tools/address.js';
import type { ToolContext } from '../../src/types/mcp.js';

const context: ToolContext = {
  client: {
    address: {
      getCities: vi.fn(),
      searchSettlements: vi.fn(),
      searchSettlementStreets: vi.fn(),
      getWarehouses: vi.fn(),
    },
    reference: {} as any,
    tracking: {} as any,
    waybill: {} as any,
  },
  config: {
    apiKey: 'test',
    baseUrl: 'https://example.com',
    logLevel: 'info',
    timeout: 1000,
  },
};

describe('address tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes seven address tools', () => {
    expect(getAddressTools()).toHaveLength(7);
  });

  describe('address_search_cities', () => {
    it('successfully searches cities', async () => {
      vi.mocked(context.client.address.getCities).mockResolvedValue({
        success: true,
        data: [{ Description: 'Київ', Ref: 'ref-123' } as any],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleAddressTool('address_search_cities', { query: 'Київ' }, context);
      expect(result.isError).toBeFalsy();
    });

    it('passes limit and page parameters to getCities', async () => {
      vi.mocked(context.client.address.getCities).mockResolvedValue({
        success: true,
        data: [{ Description: 'Київ', Ref: 'ref-123' } as any],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      await handleAddressTool('address_search_cities', { query: 'Київ', page: 2, limit: 20 }, context);

      expect(context.client.address.getCities).toHaveBeenCalledWith({
        findByString: 'Київ',
        page: 2,
        limit: 20,
      });
    });

    it('uses default limit of 10 when not provided', async () => {
      vi.mocked(context.client.address.getCities).mockResolvedValue({
        success: true,
        data: [],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      await handleAddressTool('address_search_cities', { query: 'test' }, context);

      expect(context.client.address.getCities).toHaveBeenCalledWith({
        findByString: 'test',
        page: 1,
        limit: 10,
      });
    });
  });

  describe('address_get_warehouses', () => {
    it('requires ref, cityRef, or settlementRef', async () => {
      const result = await handleAddressTool('address_get_warehouses', {}, context);
      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('ref, cityRef, or settlementRef');
    });

    it('successfully gets warehouses', async () => {
      vi.mocked(context.client.address.getWarehouses).mockResolvedValue({
        success: true,
        data: [
          {
            Description: 'Відділення №1',
            Number: '1',
            Ref: 'ref',
            ShortAddress: 'Address',
            TypeOfWarehouse: 'Warehouse',
          } as any,
        ],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleAddressTool('address_get_warehouses', { cityRef: 'city-ref' }, context);
      expect(result.isError).toBeFalsy();
    });
  });
});
