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
          counterpartyRef: 'counterparty-ref',
          firstName: 'Іван',
          lastName: 'Іванов',
          phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.save).toHaveBeenCalledWith({
        counterpartyRef: 'counterparty-ref',
        firstName: 'Іван',
        lastName: 'Іванов',
        phone: '380501234567',
        middleName: undefined,
        email: undefined,
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
          counterpartyRef: 'counterparty-ref',
          firstName: 'Петро',
          middleName: 'Петрович',
          lastName: 'Петров',
          phone: '380671234567',
          email: 'petrov@example.com',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.save).toHaveBeenCalledWith({
        counterpartyRef: 'counterparty-ref',
        firstName: 'Петро',
        middleName: 'Петрович',
        lastName: 'Петров',
        phone: '380671234567',
        email: 'petrov@example.com',
      });
    });

    it('requires counterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          firstName: 'Іван',
          lastName: 'Іванов',
          phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('counterpartyRef');
    });

    it('requires firstName', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          counterpartyRef: 'counterparty-ref',
          lastName: 'Іванов',
          phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('firstName');
    });

    it('requires lastName', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          counterpartyRef: 'counterparty-ref',
          firstName: 'Іван',
          phone: '380501234567',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('lastName');
    });

    it('requires phone', async () => {
      const result = await handleContactPersonTool(
        'contact_person_save',
        {
          counterpartyRef: 'counterparty-ref',
          firstName: 'Іван',
          lastName: 'Іванов',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('phone');
    });

    it('handles API errors', async () => {
      vi.mocked(context.client.contactPerson.save).mockResolvedValue({
        success: false,
        data: [],
        errors: ['Invalid phone number format'],
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
          counterpartyRef: 'counterparty-ref',
          firstName: 'Іван',
          lastName: 'Іванов',
          phone: 'invalid-phone',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Invalid phone number format');
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
          ref: 'contact-person-ref-123',
          counterpartyRef: 'counterparty-ref',
          firstName: 'Updated',
          lastName: 'Name',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.update).toHaveBeenCalledWith({
        ref: 'contact-person-ref-123',
        counterpartyRef: 'counterparty-ref',
        firstName: 'Updated',
        lastName: 'Name',
        middleName: undefined,
        phone: undefined,
        email: undefined,
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
          ref: 'contact-person-ref-123',
          counterpartyRef: 'counterparty-ref',
          phone: '380991234567',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.update).toHaveBeenCalledWith({
        ref: 'contact-person-ref-123',
        counterpartyRef: 'counterparty-ref',
        firstName: undefined,
        middleName: undefined,
        lastName: undefined,
        phone: '380991234567',
        email: undefined,
      });
    });

    it('requires ref', async () => {
      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          counterpartyRef: 'counterparty-ref',
          firstName: 'Updated',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('ref');
    });

    it('requires counterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_update',
        {
          ref: 'contact-person-ref-123',
          firstName: 'Updated',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('counterpartyRef');
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
          ref: 'invalid-ref',
          counterpartyRef: 'counterparty-ref',
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
          ref: 'contact-person-ref-123',
          counterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBeFalsy();
      expect(context.client.contactPerson.delete).toHaveBeenCalledWith({
        ref: 'contact-person-ref-123',
        counterpartyRef: 'counterparty-ref',
      });
      const text = (result.content[0] as any).text;
      expect(text).toContain('deleted');
    });

    it('requires ref', async () => {
      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          counterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('ref');
    });

    it('requires counterpartyRef', async () => {
      const result = await handleContactPersonTool(
        'contact_person_delete',
        {
          ref: 'contact-person-ref-123',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('counterpartyRef');
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
          ref: 'contact-person-ref-123',
          counterpartyRef: 'counterparty-ref',
        },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('Cannot delete contact person');
    });
  });
});
