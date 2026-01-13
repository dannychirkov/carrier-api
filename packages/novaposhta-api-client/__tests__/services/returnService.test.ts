import { createClient } from '../../src/core/client';
import { ReturnService } from '../../src/services/returnService';
import { createMockTransport } from '../mocks/transport';
import { PaymentMethod } from '../../src/types/enums';
import { ReturnOrderType } from '../../src/types/returns';

describe('ReturnService', () => {
  const baseUrl = 'https://api.novaposhta.ua/v2.0/json/';
  const apiKey = 'test-api-key';

  describe('getList', () => {
    it('should call transport with correct parameters and return expected response', async () => {
      const mockData = [
        {
          OrderRef: '00000000-0000-0000-0000-000000000000',
          OrderNumber: '102-00003168',
          OrderStatus: 'Прийняте',
          DocumentNumber: '20600000043015',
          CounterpartyRecipient: 'Комунальник',
          ContactPersonRecipient: 'Іванов Іван Іванович',
          AddressRecipient: 'Ангеліної Паші вул. 45 кв. 12',
          DeliveryCost: '20',
          EstimatedDeliveryDate: '12/10/15 10:33',
          ExpressWaybillNumber: '59000042651620',
          ExpressWaybillStatus: 'Відправлення у місті Київ',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.getList({
        Number: '102-00003168',
        Page: '1',
        Limit: '50',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].url).toBe(baseUrl);
      expect(calls[0].body).toMatchObject({
        modelName: 'AdditionalServiceGeneral',
        calledMethod: 'getReturnOrdersList',
        methodProperties: {
          Number: '102-00003168',
          Page: '1',
          Limit: '50',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should work with empty request parameters', async () => {
      const mockData: unknown[] = [];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.getList();

      expect(calls).toHaveLength(1);
      expect(calls[0].body.methodProperties).toEqual({});
      expect(result.success).toBe(true);
    });
  });

  describe('checkPossibility', () => {
    it('should call transport with correct parameters and return expected response', async () => {
      const mockData = [
        {
          NonCash: true,
          City: 'Київ',
          Counterparty: 'ТОВ Яблуневий сад',
          ContactPerson: 'Іванов Іван Іванович',
          Address: 'м. Київ,  вул. Хрещатик, буд. 1',
          Phone: '380950000000',
          Ref: '00000000-0000-0000-0000-000000000000',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.checkPossibility({ Number: '20450520287825' });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'AdditionalServiceGeneral',
        calledMethod: 'CheckPossibilityCreateReturn',
        methodProperties: {
          Number: '20450520287825',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.data[0].NonCash).toBe(true);
    });
  });

  describe('createToSenderAddress', () => {
    it('should call transport with correct parameters including OrderType', async () => {
      const mockData = [
        {
          Number: '102-00006096',
          Ref: '00000000-0000-0000-0000-000000000000',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.createToSenderAddress({
        IntDocNumber: '206004560074695',
        PaymentMethod: PaymentMethod.Cash,
        Reason: '00000000-0000-0000-0000-000000000001',
        SubtypeReason: '00000000-0000-0000-0000-000000000002',
        Note: 'Additional information',
        ReturnAddressRef: '00000000-0000-0000-0000-000000000003',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'AdditionalServiceGeneral',
        calledMethod: 'save',
        methodProperties: {
          IntDocNumber: '206004560074695',
          PaymentMethod: 'Cash',
          Reason: '00000000-0000-0000-0000-000000000001',
          SubtypeReason: '00000000-0000-0000-0000-000000000002',
          Note: 'Additional information',
          OrderType: 'orderCargoReturn',
          ReturnAddressRef: '00000000-0000-0000-0000-000000000003',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data[0].Number).toBe('102-00006096');
    });
  });

  describe('createToNewAddress', () => {
    it('should call transport with correct address parameters', async () => {
      const mockData = [
        {
          Number: '102-00006097',
          Ref: '00000000-0000-0000-0000-000000000001',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.createToNewAddress({
        IntDocNumber: '206004560074695',
        PaymentMethod: 'NonCash',
        Reason: '00000000-0000-0000-0000-000000000001',
        SubtypeReason: '00000000-0000-0000-0000-000000000002',
        RecipientSettlement: '00000000-0000-0000-0000-000000000010',
        RecipientSettlementStreet: '00000000-0000-0000-0000-000000000011',
        BuildingNumber: '4',
        NoteAddressRecipient: '2',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.methodProperties).toMatchObject({
        IntDocNumber: '206004560074695',
        PaymentMethod: 'NonCash',
        OrderType: 'orderCargoReturn',
        RecipientSettlement: '00000000-0000-0000-0000-000000000010',
        RecipientSettlementStreet: '00000000-0000-0000-0000-000000000011',
        BuildingNumber: '4',
        NoteAddressRecipient: '2',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('createToWarehouse', () => {
    it('should call transport with warehouse parameter', async () => {
      const mockData = [
        {
          Number: '102-00006098',
          Ref: '00000000-0000-0000-0000-000000000002',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.createToWarehouse({
        IntDocNumber: '206004560074695',
        PaymentMethod: PaymentMethod.Cash,
        Reason: '00000000-0000-0000-0000-000000000001',
        SubtypeReason: '00000000-0000-0000-0000-000000000002',
        RecipientWarehouse: '00000000-0000-0000-0000-000000000020',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.methodProperties).toMatchObject({
        OrderType: 'orderCargoReturn',
        RecipientWarehouse: '00000000-0000-0000-0000-000000000020',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('update', () => {
    it('should call transport with correct parameters and return pricing info', async () => {
      const mockData = [
        {
          ScheduledDeliveryDate: '2024-06-01 18:00:00',
          Pricing: {
            Services: [{ Service: 'Повернення посилки', Cost: 0 }],
            Total: 5.52,
            FirstDayStorage: '0000-00-00 00:00:00',
          },
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.update({
        Ref: '00000000-0000-0000-0000-000000000000',
        IntDocNumber: '20450123456789',
        PaymentMethod: PaymentMethod.Cash,
        OrderType: ReturnOrderType.CargoReturn,
        Reason: '00000000-0000-0000-0000-000000000001',
        SubtypeReason: '00000000-0000-0000-0000-000000000002',
        RecipientWarehouse: '00000000-0000-0000-0000-000000000020',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'AdditionalServiceGeneral',
        calledMethod: 'update',
        methodProperties: {
          Ref: '00000000-0000-0000-0000-000000000000',
          IntDocNumber: '20450123456789',
          PaymentMethod: 'Cash',
          OrderType: 'orderCargoReturn',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data[0].ScheduledDeliveryDate).toBe('2024-06-01 18:00:00');
    });
  });

  describe('getPricing', () => {
    it('should call update with OnlyGetPricing set to true', async () => {
      const mockData = [
        {
          ScheduledDeliveryDate: '2024-06-01 18:00:00',
          Pricing: {
            Services: [],
            Total: 10.0,
            FirstDayStorage: '0000-00-00 00:00:00',
          },
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      await client.return.getPricing({
        Ref: '00000000-0000-0000-0000-000000000000',
        IntDocNumber: '20450123456789',
        PaymentMethod: PaymentMethod.Cash,
        OrderType: ReturnOrderType.CargoReturn,
        Reason: '00000000-0000-0000-0000-000000000001',
        SubtypeReason: '00000000-0000-0000-0000-000000000002',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.methodProperties.OnlyGetPricing).toBe(true);
    });
  });

  describe('getByNumber', () => {
    it('should return order when found', async () => {
      const mockData = [
        {
          OrderRef: '00000000-0000-0000-0000-000000000000',
          OrderNumber: '102-00003168',
          OrderStatus: 'Прийняте',
          DocumentNumber: '20600000043015',
          CounterpartyRecipient: 'Test',
          ContactPersonRecipient: 'Test Person',
          AddressRecipient: 'Test Address',
          DeliveryCost: '20',
          EstimatedDeliveryDate: '12/10/15 10:33',
          ExpressWaybillNumber: '59000042651620',
          ExpressWaybillStatus: 'Test Status',
        },
      ];
      const { transport, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.getByNumber('102-00003168');

      expect(result).not.toBeNull();
      expect(result?.OrderNumber).toBe('102-00003168');
    });

    it('should return null when not found', async () => {
      const { transport, setResponse } = createMockTransport();
      setResponse({ success: true, data: [] });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.getByNumber('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getByRef', () => {
    it('should return order when found', async () => {
      const mockData = [
        {
          OrderRef: 'test-ref-123',
          OrderNumber: '102-00003168',
          OrderStatus: 'Прийняте',
          DocumentNumber: '20600000043015',
          CounterpartyRecipient: 'Test',
          ContactPersonRecipient: 'Test Person',
          AddressRecipient: 'Test Address',
          DeliveryCost: '20',
          EstimatedDeliveryDate: '12/10/15 10:33',
          ExpressWaybillNumber: '59000042651620',
          ExpressWaybillStatus: 'Test Status',
        },
      ];
      const { transport, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      const result = await client.return.getByRef('test-ref-123');

      expect(result).not.toBeNull();
      expect(result?.OrderRef).toBe('test-ref-123');
    });
  });

  describe('getByDateRange', () => {
    it('should call getList with date range parameters', async () => {
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: [] });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      await client.return.getByDateRange('01.01.2024', '31.01.2024', { page: '1', limit: '100' });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.methodProperties).toMatchObject({
        BeginDate: '01.01.2024',
        EndDate: '31.01.2024',
        page: '1',
        limit: '100',
      });
    });
  });

  describe('legacy methods', () => {
    it('getReturnOrdersList should work as alias for getList', async () => {
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: [] });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      await client.return.getReturnOrdersList({ Page: '1' });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.calledMethod).toBe('getReturnOrdersList');
    });

    it('checkPossibilityCreateReturn should work as alias for checkPossibility', async () => {
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: [] });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      await client.return.checkPossibilityCreateReturn({ Number: '12345' });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.calledMethod).toBe('CheckPossibilityCreateReturn');
    });

    it('save should work as alias for create', async () => {
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: [] });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ReturnService());

      await client.return.save({
        IntDocNumber: '12345',
        PaymentMethod: 'Cash',
        Reason: 'reason-ref',
        SubtypeReason: 'subtype-ref',
        OrderType: 'orderCargoReturn',
        ReturnAddressRef: 'address-ref',
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body.calledMethod).toBe('save');
    });
  });
});
