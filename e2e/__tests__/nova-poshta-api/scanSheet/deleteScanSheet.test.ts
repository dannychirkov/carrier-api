import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';

describe('ScanSheetService - deleteScanSheet', () => {
  itWithApiKey('should delete scan sheet', async () => {
    // Note: This test requires a valid scan sheet ref that can be deleted
    // You should create a test scan sheet first, then delete it
    const scanSheetRef = ''; // Add valid scan sheet ref for testing

    if (!scanSheetRef) {
      console.warn('Skipping test: no scan sheet ref provided');
      return;
    }

    const response = await client.scanSheet.deleteScanSheet({
      ScanSheetRefs: [scanSheetRef as any],
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should fail with invalid ref', async () => {
    const response = await client.scanSheet.deleteScanSheet({
      ScanSheetRefs: ['invalid-ref' as any],
    });

    expect(response.success).toBe(false);
  });
});
