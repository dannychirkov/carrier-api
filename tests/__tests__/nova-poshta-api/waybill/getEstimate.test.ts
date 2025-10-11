import { client } from '../../../setup/client.setup';

describe('WaybillService - getEstimate', () => {
  it('should get both price and delivery date estimation', async () => {
    const response = await client.waybill.getEstimate({
      citySender: '8d5a980d-391c-11dd-90d9-001a92567626',
      cityRecipient: 'db5c88e0-391c-11dd-90d9-001a92567626',
      weight: 1,
      serviceType: 'WarehouseWarehouse',
      cost: 1000,
      cargoType: 'Parcel',
      seatsAmount: 1,
    });

    expect(response).toBeDefined();
    expect(response.price).toBeDefined();
    expect(response.deliveryDate).toBeDefined();
    expect(response.price.success).toBe(true);
    expect(response.deliveryDate.success).toBe(true);
  });
});
