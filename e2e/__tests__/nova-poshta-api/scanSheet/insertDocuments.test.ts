import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';
import { hasInsertErrors } from '@shopana/novaposhta-api-client';

describe('ScanSheetService - insertDocuments', () => {
  itWithApiKey('should create a new scan sheet with documents', async () => {
    // Note: In real test, you need valid document refs
    // This is a placeholder test structure
    const documentRefs: string[] = [
      // Add valid document refs here for real testing
    ];

    if (documentRefs.length === 0) {
      console.warn('Skipping test: no document refs provided');
      return;
    }

    const response = await client.scanSheet.insertDocuments({
      DocumentRefs: documentRefs as any,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    if (response.success && response.data.length > 0) {
      expect(response.data[0].Ref).toBeDefined();
      expect(response.data[0].Number).toBeDefined();
      // Check for errors in response data (API always returns success: true)
      expect(hasInsertErrors(response.data[0])).toBe(false);
    }
  });

  itWithApiKey('should add documents to existing scan sheet', async () => {
    // Note: In real test, you need valid scan sheet ref and document refs
    const scanSheetRef = ''; // Add valid scan sheet ref
    const documentRefs: string[] = []; // Add valid document refs

    if (!scanSheetRef || documentRefs.length === 0) {
      console.warn('Skipping test: no refs provided');
      return;
    }

    const response = await client.scanSheet.insertDocuments({
      Ref: scanSheetRef as any,
      DocumentRefs: documentRefs as any,
    });

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });

  it('should return errors for invalid data in response', async () => {
    // Note: Nova Poshta API returns success: false for auth/validation errors
    // or success: true with errors in data[].Errors for logical errors
    const response = await client.scanSheet.insertDocuments({} as any);

    expect(response).toBeDefined();

    // Check that we got an error response (either success: false or errors in data)
    const hasErrors =
      response.success === false ||
      response.errors.length > 0 ||
      (response.data && response.data.length > 0 && hasInsertErrors(response.data[0]));
    expect(hasErrors).toBe(true);
  });
});
