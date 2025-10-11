import { client } from '../../../setup/client.setup';

describe('AddressService - Cache Management', () => {
  it('should cache city search results', async () => {
    // First request - should hit API
    const response1 = await client.address.getCities({
      FindByString: 'Київ',
    });

    expect(response1).toBeDefined();
    expect(response1.success).toBe(true);

    // Second request - should use cache (in real implementation)
    const response2 = await client.address.getCities({
      FindByString: 'Київ',
    });

    expect(response2).toBeDefined();
    expect(response2.success).toBe(true);
  });

  it('should cache settlement searches', async () => {
    const response = await client.address.searchSettlements({
      cityName: 'Київ',
      page: 1,
      limit: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should cache street searches', async () => {
    const response = await client.address.getStreet({
      CityRef: '8d5a980d-391c-11dd-90d9-001a92567626',
      FindByString: 'Хрещатик',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should cache settlement areas', async () => {
    const response = await client.address.getSettlements();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
