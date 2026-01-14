import { describe, expect, it, vi, beforeEach } from 'vitest';

import { handleReturnTool, getReturnTools } from '../../src/tools/return.js';
import type { ToolContext } from '../../src/types/mcp.js';

const baseContext: ToolContext = {
  client: {
    return: {
      getList: vi.fn(),
      checkPossibility: vi.fn(),
      createToSenderAddress: vi.fn(),
      createToNewAddress: vi.fn(),
      createToWarehouse: vi.fn(),
      update: vi.fn(),
      getPricing: vi.fn(),
    },
    address: {} as any,
    reference: {} as any,
    waybill: {} as any,
    tracking: {} as any,
    counterparty: {} as any,
    contactPerson: {} as any,
  },
  config: {
    apiKey: 'test',
    baseUrl: 'https://example.com',
    logLevel: 'debug',
    timeout: 1000,
  },
};

describe('return tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes seven return tools', () => {
    expect(getReturnTools()).toHaveLength(7);
  });

  describe('return_get_list', () => {
    it('successfully gets return orders list', async () => {
      vi.mocked(baseContext.client.return.getList).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            Number: '102-00003168',
            IntDocNumber: '20450520287825',
            OrderStatus: 'Прийняте',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool('return_get_list', {}, baseContext);

      expect(result.isError).toBeFalsy();
      expect(result.content[0]?.type).toBe('text');
      const text = (result.content[0] as any).text;
      expect(text).toContain('102-00003168');
    });

    it('successfully filters by date range', async () => {
      vi.mocked(baseContext.client.return.getList).mockResolvedValue({
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

      const result = await handleReturnTool(
        'return_get_list',
        { BeginDate: '01.01.2024', EndDate: '31.01.2024' },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      expect(baseContext.client.return.getList).toHaveBeenCalledWith({
        BeginDate: '01.01.2024',
        EndDate: '31.01.2024',
      });
    });
  });

  describe('return_check_possibility', () => {
    it('successfully checks possibility to create return', async () => {
      vi.mocked(baseContext.client.return.checkPossibility).mockResolvedValue({
        success: true,
        data: [
          {
            NonCash: true,
            City: 'Київ',
            Address: 'вул. Хрещатик, 1',
            Counterparty: 'Тест Контрагент',
            ContactPerson: 'Тест Контакт',
            Phone: '380501234567',
            Ref: '00000000-0000-0000-0000-000000000001',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool('return_check_possibility', { Number: '20450520287825' }, baseContext);

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('canReturn');
      expect(text).toContain('true');
    });

    it('fails when Number is not provided', async () => {
      const result = await handleReturnTool('return_check_possibility', {}, baseContext);

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Number');
    });
  });

  describe('return_create_to_sender_address', () => {
    it('successfully creates return to sender address', async () => {
      vi.mocked(baseContext.client.return.createToSenderAddress).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            Number: '102-00003169',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_create_to_sender_address',
        {
          IntDocNumber: '20450520287825',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000001',
          SubtypeReason: '00000000-0000-0000-0000-000000000002',
          ReturnAddressRef: '00000000-0000-0000-0000-000000000003',
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('102-00003169');
    });

    it('fails when required fields are missing', async () => {
      const result = await handleReturnTool(
        'return_create_to_sender_address',
        { IntDocNumber: '20450520287825' },
        baseContext,
      );

      expect(result.isError).toBe(true);
    });
  });

  describe('return_create_to_new_address', () => {
    it('successfully creates return to new address', async () => {
      vi.mocked(baseContext.client.return.createToNewAddress).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            Number: '102-00003170',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_create_to_new_address',
        {
          IntDocNumber: '20450520287825',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000001',
          SubtypeReason: '00000000-0000-0000-0000-000000000002',
          RecipientSettlement: '00000000-0000-0000-0000-000000000003',
          RecipientSettlementStreet: '00000000-0000-0000-0000-000000000004',
          BuildingNumber: '10',
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('102-00003170');
    });
  });

  describe('return_create_to_warehouse', () => {
    it('successfully creates return to warehouse', async () => {
      vi.mocked(baseContext.client.return.createToWarehouse).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            Number: '102-00003171',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_create_to_warehouse',
        {
          IntDocNumber: '20450520287825',
          PaymentMethod: 'NonCash',
          Reason: '00000000-0000-0000-0000-000000000001',
          SubtypeReason: '00000000-0000-0000-0000-000000000002',
          RecipientWarehouse: '00000000-0000-0000-0000-000000000003',
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('102-00003171');
    });
  });

  describe('return_update', () => {
    it('successfully updates return order', async () => {
      vi.mocked(baseContext.client.return.update).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            ScheduledDeliveryDate: '25.01.2024',
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_update',
        {
          Ref: '00000000-0000-0000-0000-000000000001',
          IntDocNumber: '20450520287825',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000002',
          SubtypeReason: '00000000-0000-0000-0000-000000000003',
          RecipientWarehouse: '00000000-0000-0000-0000-000000000004',
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('scheduledDeliveryDate');
    });

    it('handles OnlyGetPricing boolean parameter', async () => {
      vi.mocked(baseContext.client.return.update).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: '00000000-0000-0000-0000-000000000001',
            ScheduledDeliveryDate: '25.01.2024',
            Pricing: { Cost: 50 },
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_update',
        {
          Ref: '00000000-0000-0000-0000-000000000001',
          IntDocNumber: '20450520287825',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000002',
          SubtypeReason: '00000000-0000-0000-0000-000000000003',
          OnlyGetPricing: true,
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      expect(baseContext.client.return.update).toHaveBeenCalledWith(expect.objectContaining({ OnlyGetPricing: true }));
    });
  });

  describe('return_get_pricing', () => {
    it('successfully gets pricing information', async () => {
      vi.mocked(baseContext.client.return.getPricing).mockResolvedValue({
        success: true,
        data: [
          {
            ScheduledDeliveryDate: '25.01.2024',
            Pricing: { Cost: 50, DeliveryCost: 45 },
          },
        ] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReturnTool(
        'return_get_pricing',
        {
          Ref: '00000000-0000-0000-0000-000000000001',
          IntDocNumber: '20450520287825',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000002',
          SubtypeReason: '00000000-0000-0000-0000-000000000003',
        },
        baseContext,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('pricing');
      expect(text).toContain('scheduledDeliveryDate');
    });
  });

  describe('unknown tool', () => {
    it('throws error for unknown return tool', async () => {
      const result = await handleReturnTool('return_unknown', {}, baseContext);

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Unknown return tool');
    });
  });
});
