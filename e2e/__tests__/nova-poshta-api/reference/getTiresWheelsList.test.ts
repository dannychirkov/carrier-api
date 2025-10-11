import { client } from '../../../setup/client.setup';

describe('ReferenceService - getTiresWheelsList', () => {
  it('should get list of tires and wheels types', async () => {
    const response = await client.reference.getTiresWheelsList();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
