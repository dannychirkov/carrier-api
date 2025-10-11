import { client } from '../../../setup/client.setup';

describe('WaybillService - create', () => {
  it('should create a standard waybill', async () => {
    const response = await client.waybill.create({
      payerType: 'Sender',
      paymentMethod: 'Cash',
      dateTime: '25.12.2024',
      cargoType: 'Parcel',
      weight: 1,
      serviceType: 'WarehouseWarehouse',
      seatsAmount: 1,
      description: 'Test package',
      cost: 1000,
      citySender: '8d5a980d-391c-11dd-90d9-001a92567626', // Kyiv
      sender: '8d5a980d-391c-11dd-90d9-001a92567626',
      senderAddress: '8d5a980d-391c-11dd-90d9-001a92567626',
      contactSender: '8d5a980d-391c-11dd-90d9-001a92567626',
      sendersPhone: '380501234567',
      cityRecipient: '8d5a980d-391c-11dd-90d9-001a92567626',
      recipient: '8d5a980d-391c-11dd-90d9-001a92567626',
      recipientAddress: '8d5a980d-391c-11dd-90d9-001a92567626',
      contactRecipient: '8d5a980d-391c-11dd-90d9-001a92567626',
      recipientsPhone: '380507654321',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should fail with invalid data', async () => {
    const response = await client.waybill.create({} as any);

    expect(response.success).toBe(false);
  });
});
