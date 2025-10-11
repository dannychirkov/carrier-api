import { client } from '../../../setup/client.setup';

describe('WaybillService - update', () => {
  it('should update an existing waybill', async () => {
    // Note: You need a valid document ref to update
    const documentRef = 'existing-document-ref';

    const response = await client.waybill.update({
      ref: documentRef,
      payerType: 'Sender',
      paymentMethod: 'Cash',
      dateTime: '26.12.2024',
      cargoType: 'Parcel',
      weight: 2, // Updated weight
      serviceType: 'WarehouseWarehouse',
      seatsAmount: 1,
      description: 'Updated test package',
      cost: 1500, // Updated cost
    } as any);

    expect(response).toBeDefined();
  });
});
