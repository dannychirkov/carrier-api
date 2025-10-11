import { client } from '../../../setup/client.setup';

describe('ReferenceService - getOwnershipFormsList', () => {
  it('should get list of ownership forms', async () => {
    const response = await client.reference.getOwnershipFormsList();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
