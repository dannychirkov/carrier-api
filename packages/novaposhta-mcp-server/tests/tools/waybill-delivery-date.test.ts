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
    it('should fail when request.CitySender is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CityRecipient: 'city2',
            ServiceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('CitySender');
    });

    it('should fail when request.CityRecipient is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CitySender: 'city1',
            ServiceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('CityRecipient');
    });

    it('should fail when request.ServiceType is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CitySender: 'city1',
            CityRecipient: 'city2',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('ServiceType');
    });

    it('should fail when request.ServiceType is empty string', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CitySender: 'city1',
            CityRecipient: 'city2',
            ServiceType: '',
          },
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('ServiceType');
    });

    it('should succeed with valid request object', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CitySender: 'city1',
            CityRecipient: 'city2',
            ServiceType: 'WarehouseWarehouse',
          },
        },
        context,
      );
      expect(result.isError).toBeUndefined();
      expect(context.client.waybill.getDeliveryDate).toHaveBeenCalledWith(
        expect.objectContaining({
          CitySender: 'city1',
          CityRecipient: 'city2',
          ServiceType: 'WarehouseWarehouse',
        }),
      );
    });

    it('should succeed with valid request object including optional DateTime', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          request: {
            CitySender: 'city1',
            CityRecipient: 'city2',
            ServiceType: 'WarehouseWarehouse',
            DateTime: '20.11.2024',
          },
        },
        context,
      );
      expect(result.isError).toBeUndefined();
      expect(context.client.waybill.getDeliveryDate).toHaveBeenCalledWith(
        expect.objectContaining({
          CitySender: 'city1',
          CityRecipient: 'city2',
          ServiceType: 'WarehouseWarehouse',
          DateTime: '20.11.2024',
        }),
      );
    });
  });

  describe('individual parameters validation', () => {
    it('should fail when CitySender is missing', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          CityRecipient: 'city2',
          ServiceType: 'WarehouseWarehouse',
        },
        context,
      );
      expect(result.isError).toBe(true);
      expect(result.content?.[0]?.text).toContain('CitySender');
    });

    it('should succeed with valid individual parameters', async () => {
      const result = await handleWaybillTool(
        'waybill_get_delivery_date',
        {
          CitySender: 'city1',
          CityRecipient: 'city2',
          ServiceType: 'WarehouseWarehouse',
        },
        context,
      );
      expect(result.isError).toBeUndefined();
    });
  });
});
