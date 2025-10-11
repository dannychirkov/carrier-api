import { client } from '../../../setup/client.setup';

describe('TrackingService - getDocumentList', () => {
  it('should get list of documents for a date range', async () => {
    const response = await client.tracking.getDocumentList({
      dateTimeFrom: '01.01.2024',
      dateTimeTo: '31.01.2024',
      page: 1,
      getFullList: '0',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should get full document list', async () => {
    const response = await client.tracking.getDocumentList({
      dateTimeFrom: '01.01.2024',
      dateTimeTo: '31.01.2024',
      getFullList: '1',
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should get documents by specific date', async () => {
    const response = await client.tracking.getDocumentList({
      dateTime: '15.01.2024',
      page: 1,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
