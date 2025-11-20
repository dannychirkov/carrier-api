import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getReferenceTools, handleReferenceTool } from '../../src/tools/reference.js';
import type { ToolContext } from '../../src/types/mcp.js';

const context: ToolContext = {
  client: {
    reference: {
      getPackList: vi.fn(),
      getTiresWheelsList: vi.fn(),
      getCargoDescriptionList: vi.fn(),
      getPickupTimeIntervals: vi.fn(),
      getBackwardDeliveryCargoTypes: vi.fn(),
      getTypesOfPayersForRedelivery: vi.fn(),
      getCargoTypes: vi.fn(),
      getServiceTypes: vi.fn(),
      getPalletsList: vi.fn(),
      getTimeIntervals: vi.fn(),
      getOwnershipFormsList: vi.fn(),
      getMessageCodeText: vi.fn(),
      getTypesOfPayers: vi.fn(),
      getPaymentForms: vi.fn(),
      getTypesOfCounterparties: vi.fn(),
    },
    tracking: {} as any,
    address: {} as any,
    waybill: {} as any,
    counterparty: {} as any,
    contactPerson: {} as any,
  },
  config: {
    apiKey: 'test',
    baseUrl: 'https://example.com',
    logLevel: 'info',
    timeout: 1000,
  },
};

describe('reference tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes sixteen reference tools', () => {
    expect(getReferenceTools()).toHaveLength(16);
  });

  it('returns payment methods payload', async () => {
    const result = await handleReferenceTool('reference_get_payment_methods', {}, context);
    expect(result.content[0]?.type).toBe('text');
    expect(result.content[0]?.text).toContain('paymentMethods');
  });

  describe('reference_get_pack_list', () => {
    it('successfully gets pack list', async () => {
      vi.mocked(context.client.reference.getPackList).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'pack-ref',
            Description: 'Box 10x10x10',
            DescriptionRu: 'Коробка 10x10x10',
            Length: 10,
            Width: 10,
            Height: 10,
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

      const result = await handleReferenceTool('reference_get_pack_list', {}, context);
      expect(result.isError).toBeFalsy();
      expect(context.client.reference.getPackList).toHaveBeenCalled();
    });

    it('passes dimensions parameters', async () => {
      vi.mocked(context.client.reference.getPackList).mockResolvedValue({
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

      await handleReferenceTool('reference_get_pack_list', { Length: 100, Width: 50, Height: 30 }, context);
      expect(context.client.reference.getPackList).toHaveBeenCalledWith({
        Length: 100,
        Width: 50,
        Height: 30,
      });
    });
  });

  describe('reference_get_tires_wheels_list', () => {
    it('successfully gets tires and wheels list', async () => {
      vi.mocked(context.client.reference.getTiresWheelsList).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'tire-ref',
            Description: 'R14',
            DescriptionRu: 'R14',
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

      const result = await handleReferenceTool('reference_get_tires_wheels_list', {}, context);
      expect(result.isError).toBeFalsy();
    });
  });

  describe('reference_get_cargo_description_list', () => {
    it('successfully gets cargo description list', async () => {
      vi.mocked(context.client.reference.getCargoDescriptionList).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'cargo-ref',
            Description: 'Одяг',
            DescriptionRu: 'Одежда',
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

      const result = await handleReferenceTool('reference_get_cargo_description_list', {}, context);
      expect(result.isError).toBeFalsy();
    });

    it('passes findByString and page parameters', async () => {
      vi.mocked(context.client.reference.getCargoDescriptionList).mockResolvedValue({
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

      await handleReferenceTool('reference_get_cargo_description_list', { FindByString: 'Одяг', Page: 2 }, context);
      expect(context.client.reference.getCargoDescriptionList).toHaveBeenCalledWith({
        FindByString: 'Одяг',
        Page: 2,
      });
    });
  });

  describe('reference_get_pickup_time_intervals', () => {
    it('successfully gets pickup time intervals', async () => {
      vi.mocked(context.client.reference.getPickupTimeIntervals).mockResolvedValue({
        success: true,
        data: [
          {
            Number: '1' as any,
            Start: '09:00',
            End: '12:00',
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

      const result = await handleReferenceTool('reference_get_pickup_time_intervals', { SenderCityRef: 'city-ref', DateTime: '01.01.2024' }, context);
      expect(result.isError).toBeFalsy();
      expect(context.client.reference.getPickupTimeIntervals).toHaveBeenCalledWith({
        SenderCityRef: 'city-ref',
        DateTime: '01.01.2024',
      });
    });

    it('requires cityRef and dateTime parameters', async () => {
      const result = await handleReferenceTool('reference_get_pickup_time_intervals', {}, context);
      expect(result.isError).toBe(true);
    });
  });

  describe('reference_get_backward_delivery_cargo_types', () => {
    it('successfully gets backward delivery cargo types', async () => {
      vi.mocked(context.client.reference.getBackwardDeliveryCargoTypes).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'cargo-type-ref',
            Description: 'Документи',
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

      const result = await handleReferenceTool('reference_get_backward_delivery_cargo_types', {}, context);
      expect(result.isError).toBeFalsy();
    });
  });

  describe('reference_get_types_of_payers_for_redelivery', () => {
    it('successfully gets types of payers for redelivery', async () => {
      vi.mocked(context.client.reference.getTypesOfPayersForRedelivery).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'payer-type-ref',
            Description: 'Відправник',
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

      const result = await handleReferenceTool('reference_get_types_of_payers_for_redelivery', {}, context);
      expect(result.isError).toBeFalsy();
    });
  });
});
