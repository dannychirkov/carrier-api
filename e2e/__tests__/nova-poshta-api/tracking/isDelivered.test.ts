import { client } from '../../../setup/client.setup';

describe('TrackingService - isDelivered', () => {
  it('should check if document is delivered', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    // Check response.statusCode to determine if delivered
    // Delivered statuses: 9 (Received), 10 (ReceivedAwaitingMoneyTransfer), 11 (ReceivedAndMoneyTransferred)
    expect(response).toBeDefined();

    if (response) {
      const isDelivered = client.tracking.isDelivered(response);
      expect(typeof isDelivered).toBe('boolean');
    }
  });
});
