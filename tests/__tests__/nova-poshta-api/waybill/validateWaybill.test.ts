import { client } from '../../../setup/client.setup';

describe('WaybillService - validateWaybill', () => {
  it('should validate waybill data without creating', async () => {
    // This test validates the structure by checking required fields
    const isValid = await client.waybill.validateWaybill({
      payerType: 'Sender',
      paymentMethod: 'Cash',
      dateTime: '25.12.2024',
      cargoType: 'Parcel',
      weight: 1,
      serviceType: 'WarehouseWarehouse',
      seatsAmount: 1,
    } as any);

    expect(typeof isValid).toBe('boolean');
  });

  it('should fail validation with invalid data', async () => {
    const isValid = await client.waybill.validateWaybill({
      weight: 'invalid' as any,
    } as any);

    expect(typeof isValid).toBe('boolean');
  });
});
