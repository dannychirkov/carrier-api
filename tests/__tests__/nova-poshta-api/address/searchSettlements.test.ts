import { client } from '../../../setup/client.setup';

describe('AddressService - searchSettlements', () => {
  it('should search settlements online', async () => {
    const response = await client.address.searchSettlements({
      cityName: 'Київ',
      page: 1,
      limit: 5,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should search settlements with pagination', async () => {
    const response = await client.address.searchSettlements({
      cityName: 'Дніпр',
      page: 1,
      limit: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data.length).toBeLessThanOrEqual(10);
    }
  });

  it('should search settlements by partial name', async () => {
    const response = await client.address.searchSettlements({
      cityName: 'Хар',
      page: 1,
      limit: 15,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
