import { client } from '../../../setup/client.setup';

describe('ReferenceService - getPalletsList', () => {
  it('should get list of available pallets', async () => {
    const response = await client.reference.getPalletsList();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
