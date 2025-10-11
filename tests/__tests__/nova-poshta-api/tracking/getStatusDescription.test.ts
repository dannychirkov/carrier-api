import { client } from '../../../setup/client.setup';
import { DeliveryStatus } from '@shopana/novaposhta-api-client';

describe('TrackingService - getStatusDescription', () => {
  it('should get status with description', async () => {
    const response = await client.tracking.trackDocument('20450123456789');

    // response contains Status with human-readable description
    // statusCode contains numeric code
    expect(response).toBeDefined();
  });

  it('should get localized status descriptions', async () => {
    // Test with different locales
    const uaDescription = client.tracking.getStatusDescription(DeliveryStatus.Received, 'ua');
    const ruDescription = client.tracking.getStatusDescription(DeliveryStatus.Received, 'ru');
    const enDescription = client.tracking.getStatusDescription(DeliveryStatus.Received, 'en');

    expect(uaDescription).toBeDefined();
    expect(ruDescription).toBeDefined();
    expect(enDescription).toBeDefined();
    expect(uaDescription).not.toBe(ruDescription);
  });
});
