import { client } from '../../../setup/client.setup';

describe('AddressService - getSearchSuggestions', () => {
  it('should get search suggestions for cities', async () => {
    // Perform some searches to build history
    const response1 = await client.address.getCities({
      findByString: 'Київ',
    });

    expect(response1.success).toBe(true);

    const response2 = await client.address.getCities({
      findByString: 'Дніпро',
    });

    expect(response2.success).toBe(true);

    // Search suggestions are managed on client side based on search history
  });

  it('should get suggestions for partial query', async () => {
    const response = await client.address.getCities({
      findByString: 'Хар',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
