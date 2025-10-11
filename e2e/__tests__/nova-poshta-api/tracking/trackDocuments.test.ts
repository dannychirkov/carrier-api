import { client } from '../../../setup/client.setup';

describe('TrackingService - trackDocuments', () => {
  it('should track multiple documents', async () => {
    const response = await client.tracking.trackDocuments({
      documents: [
        { documentNumber: '20450123456789', phone: '' },
        { documentNumber: '20450987654321', phone: '' },
      ],
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should track documents with phone number', async () => {
    const response = await client.tracking.trackDocuments({
      documents: [{ documentNumber: '20450123456789', phone: '380501234567' }],
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
