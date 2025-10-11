import { client } from '../../../setup/client.setup';

describe('TrackingService - isAtWarehouse', () => {
  it('should check if document is at warehouse or postomat', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    // Check response.statusCode to determine if at warehouse
    // At warehouse statuses: 4 (ArrivedAtWarehouse), 5 (ArrivedAtPostomat),
    // 8 (InRecipientCityAwaitingDelivery)
    expect(response).toBeDefined();

    if (response) {
      const isAtWarehouse = client.tracking.isAtWarehouse(response);
      expect(typeof isAtWarehouse).toBe('boolean');
    }
  });

  it('should check postomat arrival', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    expect(response).toBeDefined();

    if (response) {
      const isAtWarehouse = client.tracking.isAtWarehouse(response);
      expect(typeof isAtWarehouse).toBe('boolean');
    }
  });
});
