import { client } from '../../../setup/client.setup';

describe('TrackingService - trackMultiple', () => {
  it('should track multiple documents and organize results', async () => {
    const response = await client.tracking.trackMultiple([
      '20450123456789',
      '20450987654321',
      '20451122334455',
    ]);

    expect(response).toBeDefined();
    expect(response.successful).toBeDefined();
    expect(response.failed).toBeDefined();
    expect(response.statistics).toBeDefined();
    expect(response.statistics.totalTracked).toBeGreaterThanOrEqual(0);
  });

  it('should handle mix of valid and invalid documents', async () => {
    const response = await client.tracking.trackMultiple([
      '20450123456789',
      'invalid-doc',
      '20450987654321',
    ]);

    expect(response).toBeDefined();
    expect(response.successful).toBeDefined();
    expect(response.failed).toBeDefined();
  });
});
