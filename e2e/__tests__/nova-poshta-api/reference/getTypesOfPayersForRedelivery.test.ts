import { client } from '../../../setup/client.setup';

describe('ReferenceService - getTypesOfPayersForRedelivery', () => {
  it('should get list of payer types for redelivery', async () => {
    const response = await client.reference.getTypesOfPayersForRedelivery();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
