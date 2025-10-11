import { client } from '../../../setup/client.setup';

describe('ReferenceService - getServiceTypes', () => {
  it('should get list of delivery service types', async () => {
    const response = await client.reference.getServiceTypes();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
