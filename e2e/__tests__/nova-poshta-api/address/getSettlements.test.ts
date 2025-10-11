import { client } from '../../../setup/client.setup';

describe('AddressService - getSettlements', () => {
  it('should get list of settlement areas', async () => {
    const response = await client.address.getSettlements();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should return settlements with references', async () => {
    const response = await client.address.getSettlements();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('Ref');
    }
  });
});
