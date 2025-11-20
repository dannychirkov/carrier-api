import { describe, expect, it, vi, beforeEach } from 'vitest';

import { handleWaybillTool } from '../../src/tools/waybill.js';
import type { ToolContext } from '../../src/types/mcp.js';

const createMockContext = (): ToolContext => ({
  client: {
    waybill: {
      getPrice: vi.fn().mockResolvedValue({ success: true, data: [{ Cost: 100 }] }),
      getDeliveryDate: vi.fn().mockResolvedValue({
        success: true,
        data: [
          {
            DeliveryDate: {
              date: '2024-01-15 00:00:00.000000',
              timezone_type: 3,
              timezone: 'Europe/Kiev',
            },
          },
        ],
      }),
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

describe('waybill_get_delivery_date validation', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = createMockContext();
  });

  describe('request object validation', () => {
    it('should fail when request.citySender is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            cityRecipient: 'city2',
            serviceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.citySender');
    });

    it('should fail when request.cityRecipient is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            serviceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.cityRecipient');
    });

    it('should fail when request.serviceType is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.serviceType');
    });

    it('should fail when request.serviceType is empty string', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
            serviceType: '',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('request.serviceType');
    });

    it('should succeed with valid request object', async () => {
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
      expect(context.client.waybill.getDeliveryDate).toHaveBeenCalledWith(
        expect.objectContaining({
          citySender: 'city1',
          cityRecipient: 'city2',
          serviceType: 'WarehouseWarehouse',
        }),
      );
    });

    it('should succeed with valid request object including optional dateTime', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            citySender: 'city1',
            cityRecipient: 'city2',
            serviceType: 'WarehouseWarehouse',
            dateTime: '20.11.2024',
          },
        },
        context,
      );
      expect(result.isError).toBeUndefined();
      expect(context.client.waybill.getDeliveryDate).toHaveBeenCalledWith(
        expect.objectContaining({
          citySender: 'city1',
          cityRecipient: 'city2',
          serviceType: 'WarehouseWarehouse',
          dateTime: '20.11.2024',
        }),
      );
    });
  });

  describe('individual parameters validation', () => {
    it('should fail when citySender is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          cityRecipient: 'city2',
          serviceType: 'WarehouseWarehouse',
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('citySender');
    });

    it('should succeed with valid individual parameters', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          citySender: 'city1',
          cityRecipient: 'city2',
          serviceType: 'WarehouseWarehouse',
        },
        context,
      );
      expect(result.isError).toBeUndefined();
    });
  });
});
