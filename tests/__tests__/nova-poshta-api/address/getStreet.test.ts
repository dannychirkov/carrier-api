import { client } from '../../../setup/client.setup';

describe('AddressService - getStreet', () => {
  it('should get streets in a city', async () => {
    const response = await client.address.getStreet({
      cityRef: '8d5a980d-391c-11dd-90d9-001a92567626', // Kyiv
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should search streets by name', async () => {
    const response = await client.address.getStreet({
      cityRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      findByString: 'Хрещатик',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should search streets with pagination', async () => {
    const response = await client.address.getStreet({
      cityRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      findByString: 'вул',
      page: 1,
      limit: 20,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data.length).toBeLessThanOrEqual(20);
    }
  });
});
