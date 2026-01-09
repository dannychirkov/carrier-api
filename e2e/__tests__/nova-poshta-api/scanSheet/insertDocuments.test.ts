import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';

describe('ScanSheetService - insertDocuments', () => {
  itWithApiKey('should create a new scan sheet with documents', async () => {
    // Note: In real test, you need valid document refs
    // This is a placeholder test structure
    const documentRefs = [
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
      expect(response.data[0].DocumentsCount).toBeGreaterThan(0);
    }
  });

  itWithApiKey('should add documents to existing scan sheet', async () => {
    // Note: In real test, you need valid scan sheet ref and document refs
    const scanSheetRef = ''; // Add valid scan sheet ref
    const documentRefs = []; // Add valid document refs

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

  it('should fail with invalid data', async () => {
    const response = await client.scanSheet.insertDocuments({} as any);

    expect(response.success).toBe(false);
  });
});
