import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getContactPersonTools, handleContactPersonTool } from '../../src/tools/contactPerson.js';
import type { ToolContext } from '../../src/types/mcp.js';

const context: ToolContext = {
  client: {
    contactPerson: {
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    counterparty: {} as any,
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

describe('contact person tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes three contact person tools', () => {
    expect(getContactPersonTools()).toHaveLength(3);
  });

  describe('contact_person_save', () => {
    it('successfully creates a contact person', async () => {
      vi.mocked(context.client.contactPerson.save).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'contact-person-ref-123',
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

      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Іван',
          LastName: 'Іванов',
          Phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.save).toHaveBeenCalledWith({
        CounterpartyRef: 'counterparty-ref',
        FirstName: 'Іван',
        LastName: 'Іванов',
        Phone: '380501234567',
      });
      const text = (result.content[0] as any).text;
      expect(text).toContain('contact-person-ref-123');
    });

    it('successfully creates a contact person with optional fields', async () => {
      vi.mocked(context.client.contactPerson.save).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'contact-person-ref-456',
            Description: 'Петров Петро Петрович',
            Phones: '380671234567',
            Email: 'petrov@example.com',
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

      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Петро',
          MiddleName: 'Петрович',
          LastName: 'Петров',
          Phone: '380671234567',
          Email: 'petrov@example.com',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.save).toHaveBeenCalledWith({
        CounterpartyRef: 'counterparty-ref',
        FirstName: 'Петро',
        MiddleName: 'Петрович',
        LastName: 'Петров',
        Phone: '380671234567',
        Email: 'petrov@example.com',
      });
    });

    it('requires CounterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          FirstName: 'Іван',
          LastName: 'Іванов',
          Phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('CounterpartyRef');
    });

    it('requires FirstName', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          LastName: 'Іванов',
          Phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('FirstName');
    });

    it('requires LastName', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Іван',
          Phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('LastName');
    });

    it('requires Phone', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Іван',
          LastName: 'Іванов',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Phone');
    });

    it('handles API errors', async () => {
      vi.mocked(context.client.contactPerson.save).mockResolvedValue({
        success: false,
        data: [],
        errors: ['Invalid Phone number format'],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: ['20000200001'],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Іван',
          LastName: 'Іванов',
          Phone: 'invalid-Phone',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Invalid Phone number format');
    });
  });

  describe('contact_person_update', () => {
    it('successfully updates a contact person', async () => {
      vi.mocked(context.client.contactPerson.update).mockResolvedValue({
        success: true,
        data: [
          {
            Ref: 'contact-person-ref-123',
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

      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          Ref: 'contact-person-ref-123',
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Updated',
          LastName: 'Name',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.update).toHaveBeenCalledWith({
        Ref: 'contact-person-ref-123',
        CounterpartyRef: 'counterparty-ref',
        FirstName: 'Updated',
        LastName: 'Name',
      });
    });

    it('updates only provided fields', async () => {
      vi.mocked(context.client.contactPerson.update).mockResolvedValue({
        success: true,
        data: [{ Ref: 'contact-person-ref-123' } as any],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          Ref: 'contact-person-ref-123',
          CounterpartyRef: 'counterparty-ref',
          Phone: '380991234567',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.update).toHaveBeenCalledWith({
        Ref: 'contact-person-ref-123',
        CounterpartyRef: 'counterparty-ref',
        Phone: '380991234567',
      });
    });

    it('requires ref', async () => {
      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          CounterpartyRef: 'counterparty-ref',
          FirstName: 'Updated',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Ref');
    });

    it('requires CounterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          Ref: 'contact-person-ref-123',
          FirstName: 'Updated',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('CounterpartyRef');
    });

    it('handles API errors', async () => {
      vi.mocked(context.client.contactPerson.update).mockResolvedValue({
        success: false,
        data: [],
        errors: ['Contact person not found'],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: ['20000200002'],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          Ref: 'invalid-ref',
          CounterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Contact person not found');
    });
  });

  describe('contact_person_delete', () => {
    it('successfully deletes a contact person', async () => {
      vi.mocked(context.client.contactPerson.delete).mockResolvedValue({
        success: true,
        data: [{ Ref: 'contact-person-ref-123' } as any],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          Ref: 'contact-person-ref-123',
          CounterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.delete).toHaveBeenCalledWith({
        Ref: 'contact-person-ref-123',
        CounterpartyRef: 'counterparty-ref',
      });
      const text = (result.content[0] as any).text;
      expect(text).toContain('deleted');
    });

    it('requires ref', async () => {
      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          CounterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Ref');
    });

    it('requires CounterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          Ref: 'contact-person-ref-123',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('CounterpartyRef');
    });

    it('handles API errors', async () => {
      vi.mocked(context.client.contactPerson.delete).mockResolvedValue({
        success: false,
        data: [],
        errors: ['Cannot delete contact person'],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: ['20000200003'],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          Ref: 'contact-person-ref-123',
          CounterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Cannot delete contact person');
    });
  });
});
