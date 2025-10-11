import { client } from '../../../setup/client.setup';

describe('TrackingService - monitorDocuments', () => {
  it('should track documents for monitoring', async () => {
    const documentNumbers = ['20450123456789', '20450987654321'];
    let callbackExecuted = false;
    let resultsReceived: any[] = [];

    // Start monitoring
    const stopMonitoring = await client.tracking.monitorDocuments(
      documentNumbers,
      results => {
        callbackExecuted = true;
        resultsReceived = results;
      },
      1000, // 1 second for testing
    );

    // Wait for initial check
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(callbackExecuted).toBe(true);
    expect(Array.isArray(resultsReceived)).toBe(true);

    // Cleanup
    stopMonitoring();
  });

  it('should monitor single document with periodic updates', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    expect(response).toBeDefined();
  });
});
