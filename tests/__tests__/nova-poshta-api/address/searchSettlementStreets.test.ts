import { client } from '../../../setup/client.setup';

describe('AddressService - searchSettlementStreets', () => {
  it('should search streets in a settlement', async () => {
    const response = await client.address.searchSettlementStreets({
      streetName: 'Хрещатик',
      settlementRef: '8d5a980d-391c-11dd-90d9-001a92567626', // Kyiv
      limit: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should search streets by partial name', async () => {
    const response = await client.address.searchSettlementStreets({
      streetName: 'вул',
      settlementRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      limit: 20,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data.length).toBeLessThanOrEqual(20);
    }
  });

  it('should search streets in different city', async () => {
    const response = await client.address.searchSettlementStreets({
      streetName: 'Гоголя',
      settlementRef: 'db5c88e0-391c-11dd-90d9-001a92567626', // Dnipro
      limit: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
