import { client } from '../../../setup/client.setup';

describe('TrackingService - getDocumentMovement', () => {
  it('should get document movement history', async () => {
    const response = await client.tracking.getDocumentMovement({
      documents: [{ documentNumber: '20450123456789', phone: '' }],
      showDeliveryDetails: true,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should get movement without delivery details', async () => {
    const response = await client.tracking.getDocumentMovement({
      documents: [{ documentNumber: '20450123456789', phone: '' }],
      showDeliveryDetails: false,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
