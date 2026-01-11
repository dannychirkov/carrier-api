import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';
import { hasDeleteError } from '@shopana/novaposhta-api-client';

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

  it('should return error for invalid ref', async () => {
    // Note: Nova Poshta API returns success: false for auth/validation errors
    // or success: true with errors in data[].Error for logical errors
    const response = await client.scanSheet.deleteScanSheet({
      ScanSheetRefs: ['invalid-ref' as any],
    });

    expect(response).toBeDefined();

    // Check that we got an error response (either success: false or errors in data)
    const hasErrors =
      response.success === false ||
      response.errors.length > 0 ||
      (response.data && response.data.length > 0 && hasDeleteError(response.data[0]));
    expect(hasErrors).toBe(true);
  });
});
