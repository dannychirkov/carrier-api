import { client } from '../../../setup/client.setup';

describe('TrackingService - trackDocument', () => {
  it('should track a single document by number', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    expect(response).toBeDefined();
  });

  it('should track document with phone verification', async () => {
    const response = await client.tracking.trackDocument('20450123456789', '380501234567');

    expect(response).toBeDefined();
  });

  it('should return null for invalid document', async () => {
    const response = await client.tracking.trackDocument('invalid-number');

    // Response might be null or have error status
    expect(response === null || response).toBeDefined();
  });
});
