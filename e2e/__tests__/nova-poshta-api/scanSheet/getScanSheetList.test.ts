import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';

describe('ScanSheetService - getScanSheetList', () => {
  itWithApiKey('should get list of scan sheets', async () => {
    const response = await client.scanSheet.getScanSheetList({
      Page: 1,
      Limit: 10,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });

  itWithApiKey('should get scan sheet list with default parameters', async () => {
    const response = await client.scanSheet.getScanSheetList();

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  itWithApiKey('should handle pagination correctly', async () => {
    const page1 = await client.scanSheet.getScanSheetList({
      Page: 1,
      Limit: 5,
    });

    const page2 = await client.scanSheet.getScanSheetList({
      Page: 2,
      Limit: 5,
    });

    expect(page1.success).toBe(true);
    expect(page2.success).toBe(true);

    if (page1.data.length > 0 && page2.data.length > 0) {
      // Different pages should have different data
      expect(page1.data[0].Ref).not.toBe(page2.data[0].Ref);
    }
  });
});
