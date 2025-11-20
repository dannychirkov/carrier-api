import { describe, expect, it, vi, beforeEach } from 'vitest';

import { handleTrackingTool } from '../../src/tools/tracking.js';
import { handleAddressTool } from '../../src/tools/address.js';
import { handleReferenceTool } from '../../src/tools/reference.js';
import { handleCounterpartyTool } from '../../src/tools/counterparty.js';
import { handleContactPersonTool } from '../../src/tools/contactPerson.js';
import { handleWaybillTool } from '../../src/tools/waybill.js';
import type { ToolContext } from '../../src/types/mcp.js';

/**
 * Integration tests to verify that all data is returned in the correct format for LLM consumption
 * These tests ensure that:
 * 1. All tool responses follow MCP protocol (CallToolResult format)
 * 2. Response content is properly formatted (text or JSON)
 * 3. Error responses are properly structured
 * 4. All important data fields are present in responses
 */

const createMockContext = (): ToolContext => ({
  client: {
    tracking: {
      trackDocument: vi.fn(),
      trackDocuments: vi.fn(),
      getDocumentMovement: vi.fn(),
      getDocumentList: vi.fn(),
    },
    address: {
      getCities: vi.fn(),
      searchSettlements: vi.fn(),
      searchSettlementStreets: vi.fn(),
      getWarehouses: vi.fn(),
      saveAddress: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
    },
    reference: {
      getCargoTypes: vi.fn(),
      getServiceTypes: vi.fn(),
      getBackwardDeliveryCargoTypes: vi.fn(),
      getTypesOfPayers: vi.fn(),
      getPaymentForms: vi.fn(),
      getTypesOfCounterparties: vi.fn(),
      getTypesOfPayer: vi.fn(),
      getOwnershipForms: vi.fn(),
      getPalletTypes: vi.fn(),
      getTimeIntervals: vi.fn(),
      decodeMessage: vi.fn(),
    },
    counterparty: {
      getCounterparties: vi.fn(),
      getCounterpartyAddresses: vi.fn(),
      getCounterpartyContactPersons: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getCounterpartyOptions: vi.fn(),
    },
    contactPerson: {
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    waybill: {
      getPrice: vi.fn(),
      getDeliveryDate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  config: {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.novaposhta.ua/v2.0',
    logLevel: 'info',
    timeout: 30000,
  },
});

describe('Data Format Integration Tests', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = createMockContext();
    vi.clearAllMocks();
  });

  describe('Response Format Validation', () => {
    it('tracking tool returns properly formatted response with all essential fields', async () => {
      const mockTrackingData = {
        Number: '20450123456789',
        Status: 'Доставлено',
        StatusCode: '9',
        CityRecipient: 'Київ',
        WarehouseRecipient: 'Відділення №1',
        ScheduledDeliveryDate: '20.11.2025',
        ActualDeliveryDate: '20.11.2025',
        RecipientDateTime: '20.11.2025 14:30',
        DocumentWeight: '5.0',
        DocumentCost: '1000',
        CargoType: 'Parcel',
        ServiceType: 'WarehouseWarehouse',
        PaymentMethod: 'Cash',
        PayerType: 'Recipient',
      };

      vi.mocked(context.client.tracking.trackDocument).mockResolvedValue(mockTrackingData as any);

      const result = await handleTrackingTool(
        'track_document',
        { documentNumber: '20450123456789' },
        context,
      );

      // Verify MCP protocol compliance
      expect(result).toHaveProperty('content');
      expect(result.isError).toBeUndefined(); // Success responses don't have isError

      // Verify content structure
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0]).toHaveProperty('type');
      expect(result.content[0]?.type).toBe('text');

      // Verify all important fields are present in response
      const text = (result.content[0] as any).text;
      expect(text).toContain('20450123456789');
      expect(text).toContain('Доставлено');
      expect(text).toContain('Київ');
      expect(text).toContain('Відділення №1');
    });

    it('address tool returns JSON-formatted data with proper structure', async () => {
      const mockAddresses = [
        {
          MainDescription: 'Київ',
          Area: 'Київська',
          Region: '',
          Warehouses: 500,
          Ref: 'settlement-ref-123',
          DeliveryCity: 'city-ref-123',
        },
        {
          MainDescription: 'Львів',
          Area: 'Львівська',
          Region: '',
          Warehouses: 300,
          Ref: 'settlement-ref-456',
          DeliveryCity: 'city-ref-456',
        },
      ];

      vi.mocked(context.client.address.searchSettlements).mockResolvedValue({
        success: true,
        data: [{ Addresses: mockAddresses }] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleAddressTool(
        'address_search_settlements',
        { cityName: 'Київ', limit: 10 },
        context,
      );

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify JSON structure - response is direct JSON, not wrapped in markdown
      const jsonData = JSON.parse(text);

      // Verify all settlements data is present
      expect(jsonData).toHaveProperty('total');
      expect(jsonData).toHaveProperty('settlements');
      expect(jsonData.settlements).toHaveLength(2);
      expect(jsonData.settlements[0]).toHaveProperty('name');
      expect(jsonData.settlements[0]).toHaveProperty('settlementRef');
      expect(jsonData.settlements[0]).toHaveProperty('deliveryCity');
    });

    it('reference tool returns complete reference data', async () => {
      const mockCargoTypes = [
        { Description: 'Посилка', Ref: 'Parcel' },
        { Description: 'Вантаж', Ref: 'Cargo' },
        { Description: 'Документи', Ref: 'Documents' },
        { Description: 'Шини-диски', Ref: 'TiresWheels' },
        { Description: 'Палети', Ref: 'Pallet' },
      ];

      vi.mocked(context.client.reference.getCargoTypes).mockResolvedValue({
        success: true,
        data: mockCargoTypes as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleReferenceTool('reference_get_cargo_types', {}, context);

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify all cargo types are present
      expect(text).toContain('Parcel');
      expect(text).toContain('Cargo');
      expect(text).toContain('Documents');
      expect(text).toContain('TiresWheels');
      expect(text).toContain('Pallet');

      // Verify Ukrainian descriptions are preserved
      expect(text).toContain('Посилка');
      expect(text).toContain('Документи');
    });

    it('counterparty tool returns all necessary fields for LLM', async () => {
      const mockCounterparties = [
        {
          Ref: 'counterparty-ref-123',
          Description: 'Іванов Іван Іванович',
          CounterpartyType: 'PrivatePerson',
          City: 'Київ',
          CityRef: 'city-ref',
          Phone: '380501234567',
          Email: 'test@example.com',
        },
      ];

      vi.mocked(context.client.counterparty.getCounterparties).mockResolvedValue({
        success: true,
        data: mockCounterparties as any,
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

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify all essential counterparty fields
      expect(text).toContain('counterparty-ref-123');
      expect(text).toContain('Іванов Іван Іванович');
      expect(text).toContain('PrivatePerson');
      expect(text).toContain('Київ');
    });

    it('waybill calculation returns clear cost information', async () => {
      const mockPriceResponse = {
        success: true,
        data: [{
          Cost: 115,
          AssessedCost: 1000
        }],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      };

      const mockDeliveryResponse = {
        success: true,
        data: [{
          DeliveryDate: { date: '2025-11-21 15:00:00' }
        }],
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      };

      vi.mocked(context.client.waybill.getPrice).mockResolvedValue(mockPriceResponse as any);
      vi.mocked(context.client.waybill.getDeliveryDate).mockResolvedValue(mockDeliveryResponse as any);

      const result = await handleWaybillTool(
        'waybill_calculate_cost',
        {
          citySender: 'city-ref-1',
          cityRecipient: 'city-ref-2',
          weight: 5,
          serviceType: 'WarehouseWarehouse',
          cost: 1000,
          cargoType: 'Parcel',
          seatsAmount: 1,
        },
        context,
      );

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify cost information is clearly presented
      expect(text).toContain('115');
    });
  });

  describe('Error Response Format', () => {
    it('returns properly formatted error when API fails', async () => {
      vi.mocked(context.client.tracking.trackDocument).mockResolvedValue(null);

      const result = await handleTrackingTool(
        'track_document',
        { documentNumber: '20450123456789' },
        context,
      );

      expect(result.isError).toBeUndefined(); // Not found is not an error, just empty result
      const text = (result.content[0] as any).text;
      expect(text).toContain('not found');
    });

    it('returns validation error with clear message', async () => {
      const result = await handleTrackingTool(
        'track_document',
        { documentNumber: '123' }, // Invalid tracking number
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('14-digit');
    });

    it('handles API errors gracefully with error details', async () => {
      vi.mocked(context.client.counterparty.getCounterparties).mockResolvedValue({
        success: false,
        data: [],
        errors: ['User is undefined'],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: ['20000101582'],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleCounterpartyTool(
        'counterparty_get_counterparties',
        { counterpartyProperty: 'Sender' },
        context,
      );

      expect(result.isError).toBe(true);
      const text = (result.content[0] as any).text;
      expect(text).toContain('User is undefined');
    });
  });

  describe('Data Completeness', () => {
    it('warehouses response includes all required fields for LLM decision making', async () => {
      const mockWarehouses = [
        {
          SiteKey: '1',
          Description: 'Відділення №1: вул. Хрещатик, 1',
          DescriptionRu: 'Отделение №1: ул. Крещатик, 1',
          ShortAddress: 'Київ, Хрещатик, 1',
          Phone: '380800500609',
          TypeOfWarehouse: '9a68df70-0267-42a8-bb5c-37f427e36ee4',
          Ref: 'warehouse-ref-1',
          Number: '1',
          CityRef: 'city-ref',
          CityDescription: 'Київ',
          Longitude: '30.523333',
          Latitude: '50.450001',
          PostFinance: '1',
          BicycleParking: '1',
          POSTerminal: '1',
          Schedule: {
            Monday: '08:00-21:00',
            Tuesday: '08:00-21:00',
            Wednesday: '08:00-21:00',
            Thursday: '08:00-21:00',
            Friday: '08:00-21:00',
            Saturday: '09:00-19:00',
            Sunday: '09:00-19:00',
          },
        },
      ];

      vi.mocked(context.client.address.getWarehouses).mockResolvedValue({
        success: true,
        data: mockWarehouses as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleAddressTool(
        'address_get_warehouses',
        { cityRef: 'city-ref', limit: 10 },
        context,
      );

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify JSON structure contains all essential warehouse information
      const jsonData = JSON.parse(text);

      expect(jsonData.warehouses[0]).toHaveProperty('Description');
      expect(jsonData.warehouses[0]).toHaveProperty('ShortAddress');
      expect(jsonData.warehouses[0]).toHaveProperty('Phone');
      expect(jsonData.warehouses[0]).toHaveProperty('Ref');
      expect(jsonData.warehouses[0]).toHaveProperty('Number');
      expect(jsonData.warehouses[0]).toHaveProperty('Schedule');
      expect(jsonData.warehouses[0]).toHaveProperty('POSTerminal');
      expect(jsonData.warehouses[0]).toHaveProperty('Longitude');
      expect(jsonData.warehouses[0]).toHaveProperty('Latitude');
    });

    it('contact person creation returns all necessary identification data', async () => {
      const mockContactPerson = {
        Ref: 'contact-ref-new',
        Description: 'Новий Контакт Особистий',
        Phones: '380501234567',
        Email: 'new@example.com',
        LastName: 'Новий',
        FirstName: 'Контакт',
        MiddleName: 'Особистий',
      };

      vi.mocked(context.client.contactPerson.save).mockResolvedValue({
        success: true,
        data: [mockContactPerson as any],
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
          firstName: 'Контакт',
          middleName: 'Особистий',
          lastName: 'Новий',
          phone: '380501234567',
          email: 'new@example.com',
        },
        context,
      );

      expect(result.isError).toBeUndefined(); // Success responses don't have isError
      const text = (result.content[0] as any).text;

      // Verify contact person ref and description are returned
      // Note: API only returns ref and description, not phone/email
      expect(text).toContain('contact-ref-new');
      expect(text).toContain('Новий Контакт Особистий');
    });
  });

  describe('Unicode and Special Characters', () => {
    it('preserves Ukrainian characters in responses', async () => {
      const mockData = {
        Number: '20450123456789',
        Status: 'Відправлення у місті КИЇВ. Очікує прибуття на відділення',
        CityRecipient: 'Київ',
        WarehouseRecipient: 'Відділення №1: вул. Хрещатик, 1',
      };

      vi.mocked(context.client.tracking.trackDocument).mockResolvedValue(mockData as any);

      const result = await handleTrackingTool(
        'track_document',
        { documentNumber: '20450123456789' },
        context,
      );

      const text = (result.content[0] as any).text;

      // Verify Ukrainian text is preserved correctly
      expect(text).toContain('Відправлення');
      expect(text).toContain('Київ');
      expect(text).toContain('Відділення');
      expect(text).toContain('Хрещатик');
    });

    it('handles special characters in addresses', async () => {
      const mockAddresses = [
        {
          StreetsType: "вул.",
          StreetsTypeDescription: "вулиця",
          SettlementStreetDescription: "Шевченка Т.Г.",
          SettlementStreetRef: 'street-ref-1',
          Present: 'вул. Шевченка Т.Г.',
          Location: { lat: 50.45, lon: 30.52 },
        },
      ];

      vi.mocked(context.client.address.searchSettlementStreets).mockResolvedValue({
        success: true,
        data: [{ Addresses: mockAddresses }] as any,
        errors: [],
        warnings: [],
        info: [],
        messageCodes: [],
        errorCodes: [],
        warningCodes: [],
        infoCodes: [],
      });

      const result = await handleAddressTool(
        'address_search_streets',
        { settlementRef: 'settlement-ref', streetName: 'Шевченка', limit: 10 },
        context,
      );

      const text = (result.content[0] as any).text;
      const jsonData = JSON.parse(text);

      expect(jsonData.streets).toHaveLength(1);
      expect(jsonData.streets[0].name).toContain('Шевченка');
    });
  });
});
