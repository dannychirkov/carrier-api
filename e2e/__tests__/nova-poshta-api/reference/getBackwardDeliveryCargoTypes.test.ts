import { client } from '../../../setup/client.setup';

describe('ReferenceService - getBackwardDeliveryCargoTypes', () => {
  it('should get list of backward delivery cargo types', async () => {
    const response = await client.reference.getBackwardDeliveryCargoTypes();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
