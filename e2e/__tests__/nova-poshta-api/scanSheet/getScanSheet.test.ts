import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';

describe('ScanSheetService - getScanSheet', () => {
  itWithApiKey('should get scan sheet by ref', async () => {
    // First, get list of scan sheets to get a valid ref
    const listResponse = await client.scanSheet.getScanSheetList({ Page: 1, Limit: 1 });

    if (!listResponse.success || listResponse.data.length === 0) {
      console.warn('Skipping test: no scan sheets found');
      return;
    }

    const scanSheetRef = listResponse.data[0].Ref;

    const response = await client.scanSheet.getScanSheet({
      Ref: scanSheetRef,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    if (response.success && response.data.length > 0) {
      expect(response.data[0].Ref).toBe(scanSheetRef);
      expect(response.data[0].Number).toBeDefined();
    }
  });

  it('should fail with invalid ref', async () => {
    const response = await client.scanSheet.getScanSheet({
      Ref: 'invalid-ref' as any,
    });

    expect(response.success).toBe(false);
  });
});
