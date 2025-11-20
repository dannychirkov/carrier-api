import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getWaybillTools, handleWaybillTool } from '../../src/tools/waybill.js';
import type { ToolContext } from '../../src/types/mcp.js';

const createMockContext = (): ToolContext => ({
  client: {
    waybill: {
      getPrice: vi.fn().mockResolvedValue({ success: true, data: [{ Cost: 100 }] }),
      getDeliveryDate: vi.fn().mockResolvedValue({ success: true, data: [{ DeliveryDate: '2024-01-01' }] }),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    tracking: {} as any,
    address: {} as any,
    reference: {} as any,
  },
  config: {
    apiKey: 'test',
    baseUrl: 'https://example.com',
    logLevel: 'info',
    timeout: 1000,
  },
});

describe('waybill tools', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = createMockContext();
  });

  it('exposes five waybill tools', () => {
    expect(getWaybillTools()).toHaveLength(5);
  });

  it('requires document refs for delete tool', async () => {
    const result = await handleWaybillTool('waybill_delete', { documentRefs: [] }, context);
    expect(result.isError).toBe(true);
  });

  describe('waybill_calculate_cost', () => {
    it('validates required fields in request object', async () => {
      const result = await handleWaybillTool(
        'waybill_calculate_cost',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
            // Missing serviceType
            cargoType: 'Parcel',
            cost: 100,
            weight: 1,
            seatsAmount: 1,
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.serviceType');
    });

    it('validates all required fields when using request object', async () => {
      const result = await handleWaybillTool(
        'waybill_calculate_cost',
        {
          request: {},
        },
        context,
      );
      expect(result.isError).toBe(true);
    });

    it('works with valid request object', async () => {
      const result = await handleWaybillTool(
        'waybill_calculate_cost',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
            serviceType: 'WarehouseWarehouse',
            cargoType: 'Parcel',
            cost: 100,
            weight: 1,
            seatsAmount: 1,
          },
        },
        context,
      );
      expect(result.isError).toBeUndefined();
    });

    it('works with individual parameters', async () => {
      const result = await handleWaybillTool(
        'waybill_calculate_cost',
        {
          citySender: 'city1',
          cityRecipient: 'city2',
          serviceType: 'WarehouseWarehouse',
          cargoType: 'Parcel',
          cost: 100,
          weight: 1,
          seatsAmount: 1,
        },
        context,
      );
      expect(result.isError).toBeUndefined();
    });
  });

  describe('waybill_get_delivery_date', () => {
    it('validates required fields in request object', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            // Missing cityRecipient and serviceType
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.cityRecipient');
    });

    it('works with valid request object', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
            serviceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBeUndefined();
    });
  });
});
