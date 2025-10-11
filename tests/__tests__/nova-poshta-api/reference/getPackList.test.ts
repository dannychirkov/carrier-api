import { client } from '../../../setup/client.setup';

describe('ReferenceService - getPackList', () => {
  it('should get list of packaging types', async () => {
    const response = await client.reference.getPackList();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should get pack list with dimensions filter', async () => {
    const response = await client.reference.getPackList({
      length: 100,
      width: 50,
      height: 30,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});
