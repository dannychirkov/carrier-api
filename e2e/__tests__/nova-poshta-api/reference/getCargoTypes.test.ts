import { client } from '../../../setup/client.setup';

describe('ReferenceService - getCargoTypes', () => {
  it('should get list of cargo types', async () => {
    const response = await client.reference.getCargoTypes();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should return cargo types with descriptions', async () => {
    const response = await client.reference.getCargoTypes();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty('Ref');
      expect(response.data[0]).toHaveProperty('Description');
    }
  });
});
