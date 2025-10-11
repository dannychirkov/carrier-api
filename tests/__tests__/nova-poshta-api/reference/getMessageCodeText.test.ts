import { client } from '../../../setup/client.setup';

describe('ReferenceService - getMessageCodeText', () => {
  it('should get list of error codes and descriptions', async () => {
    const response = await client.reference.getMessageCodeText();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
