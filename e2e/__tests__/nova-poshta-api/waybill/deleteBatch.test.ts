import { client } from '../../../setup/client.setup';

describe('WaybillService - deleteBatch', () => {
  it('should delete multiple waybills at once', async () => {
    // Note: You need valid document refs to delete
    const documentRefs = ['ref-1', 'ref-2', 'ref-3'];

    const response = await client.waybill.deleteBatch(documentRefs as any);

    expect(response).toBeDefined();
  });
});
