import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getCounterpartyTools, handleCounterpartyTool } from '../../src/tools/counterparty.js';
import type { ToolContext } from '../../src/types/mcp.js';

const context: ToolContext = {
  client: {
    counterparty: {
      getCounterparties: vi.fn(),
      getCounterpartyAddresses: vi.fn(),
      getCounterpartyContactPersons: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getCounterpartyOptions: vi.fn(),
    },
    address: {} as any,
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

describe('counterparty tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes seven counterparty tools', () => {
    expect(getCounterpartyTools()).toHaveLength(7);
  });

  describe('counterparty_get_counterparties', () => {
    it('successfully gets counterparties list', async () => {
      vi.mocked(context.client.counterparty.getCounterparties).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'counterparty-ref-123',
            Description: 'Test Counterparty',
            CounterpartyType: 'PrivatePerson',
            City: 'Київ',
            CityRef: 'city-ref',
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

      const result = await handleCounterpartyTool(
        'counterparty_get_counterparties',
        { counterpartyProperty: 'Sender' },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.counterparty.getCounterparties).toHaveBeenCalledWith({
        counterpartyProperty: 'Sender',
        page: undefined,
        findByString: undefined,
        cityRef: undefined,
      });
      const text = (result.content[0] as any).text;
      expect(text).toContain('counterparty-ref-123');
    });

    it('requires counterpartyProperty', async () => {
      const result = await handleCounterpartyTool('counterparty_get_counterparties', {}, context);

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('counterpartyProperty');
    });

    it('accepts search filters', async () => {
      vi.mocked(context.client.counterparty.getCounterparties).mockResolvedValue({
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

      await handleCounterpartyTool(
        'counterparty_get_counterparties',
        {
          counterpartyProperty: 'Recipient',
          findByString: 'John',
          cityRef: 'city-123',
          page: 2,
        },
        context,
      );

      expect(context.client.counterparty.getCounterparties).toHaveBeenCalledWith({
        counterpartyProperty: 'Recipient',
        page: 2,
        findByString: 'John',
        cityRef: 'city-123',
      });
    });
  });

  describe('counterparty_get_addresses', () => {
    it('successfully gets counterparty addresses', async () => {
      vi.mocked(context.client.counterparty.getCounterpartyAddresses).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'address-ref-123',
            Description: 'вул. Шевченка, 1, кв. 10',
            StreetsType: 'вул.',
            StreetsTypeDescription: 'вулиця',
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

      const result = await handleCounterpartyTool(
        'counterparty_get_addresses',
        { ref: 'counterparty-ref', counterpartyProperty: 'Sender' },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('address-ref-123');
    });

    it('requires ref', async () => {
      const result = await handleCounterpartyTool('counterparty_get_addresses', {}, context);

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('ref');
    });
  });

  describe('counterparty_get_contact_persons', () => {
    it('successfully gets contact persons', async () => {
      vi.mocked(context.client.counterparty.getCounterpartyContactPersons).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'contact-ref-123',
            Description: 'Іванов Іван Іванович',
            Phones: '380501234567',
            Email: 'test@example.com',
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

      const result = await handleCounterpartyTool(
        'counterparty_get_contact_persons',
        { ref: 'counterparty-ref' },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('contact-ref-123');
    });
  });

  describe('counterparty_save', () => {
    it('successfully creates a private person counterparty', async () => {
      vi.mocked(context.client.counterparty.save).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'new-counterparty-ref',
            Description: 'Іванов Іван',
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

      const result = await handleCounterpartyTool(
        'counterparty_save',
        {
          counterpartyType: 'PrivatePerson',
          counterpartyProperty: 'Sender',
          firstName: 'Іван',
          lastName: 'Іванов',
          phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('new-counterparty-ref');
    });

    it('successfully creates an organization counterparty', async () => {
      vi.mocked(context.client.counterparty.save).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'org-counterparty-ref',
            Description: 'ТОВ Тест',
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

      const result = await handleCounterpartyTool(
        'counterparty_save',
        {
          counterpartyType: 'Organization',
          counterpartyProperty: 'Sender',
          phone: '380501234567',
          ownershipForm: 'ownership-ref',
          edrpou: '12345678',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('org-counterparty-ref');
    });

    it('requires phone number', async () => {
      const result = await handleCounterpartyTool(
        'counterparty_save',
        {
          counterpartyType: 'PrivatePerson',
          counterpartyProperty: 'Sender',
          firstName: 'Іван',
          lastName: 'Іванов',
        },
        context,
      );

      expect(result.isError).toBe(true);
    });
  });

  describe('counterparty_update', () => {
    it('successfully updates counterparty', async () => {
      vi.mocked(context.client.counterparty.update).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'counterparty-ref',
            Description: 'Updated Name',
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

      const result = await handleCounterpartyTool(
        'counterparty_update',
        {
          ref: 'counterparty-ref',
          counterpartyProperty: 'Sender',
          firstName: 'Updated',
          lastName: 'Name',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
    });

    it('requires ref and counterpartyProperty', async () => {
      const result = await handleCounterpartyTool('counterparty_update', {}, context);

      expect(result.isError).toBe(true);
    });
  });

  describe('counterparty_delete', () => {
    it('successfully deletes counterparty', async () => {
      vi.mocked(context.client.counterparty.delete).mockResolvedValue({
        success: true,
        data: [{ Ref: 'deleted-ref' } as any],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleCounterpartyTool(
        'counterparty_delete',
        { ref: 'counterparty-ref' },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('deleted');
    });

    it('requires ref', async () => {
      const result = await handleCounterpartyTool('counterparty_delete', {}, context);

      expect(result.isError).toBe(true);
    });
  });

  describe('counterparty_get_options', () => {
    it('successfully gets counterparty options', async () => {
      vi.mocked(context.client.counterparty.getCounterpartyOptions).mockResolvedValue({
        success: true,
        data: [
          {
            CanCreateReturn: true,
            CanCreditDocuments: true,
            CanEWTransporter: false,
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

      const result = await handleCounterpartyTool(
        'counterparty_get_options',
        { ref: 'counterparty-ref' },
        context,
      );

      expect(result.isError).toBeFalsy();
      const text = (result.content[0] as any).text;
      expect(text).toContain('CanCreateReturn');
    });
  });
});
