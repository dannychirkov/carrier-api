import { client } from '../../../setup/client.setup';
import { itWithApiKey } from '../../../setup/testHelpers';

describe('ScanSheetService - convenience methods', () => {
  describe('createScanSheet', () => {
    itWithApiKey('should create scan sheet using convenience method', async () => {
      const documentRefs: string[] = [
        // Add valid document refs here for real testing
      ];

      if (documentRefs.length === 0) {
        console.warn('Skipping test: no document refs provided');
        return;
      }

      const response = await client.scanSheet.createScanSheet(documentRefs);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });

  describe('addDocuments', () => {
    itWithApiKey('should add documents using convenience method', async () => {
      const scanSheetRef = ''; // Add valid scan sheet ref
      const documentRefs: string[] = []; // Add valid document refs

      if (!scanSheetRef || documentRefs.length === 0) {
        console.warn('Skipping test: no refs provided');
        return;
      }

      const response = await client.scanSheet.addDocuments(scanSheetRef, documentRefs);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });

  describe('deleteSingle', () => {
    itWithApiKey('should delete single scan sheet using convenience method', async () => {
      const scanSheetRef = ''; // Add valid scan sheet ref

      if (!scanSheetRef) {
        console.warn('Skipping test: no scan sheet ref provided');
        return;
      }

      const response = await client.scanSheet.deleteSingle(scanSheetRef);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });
  });

  describe('getAllScanSheets', () => {
    itWithApiKey('should get all scan sheets', async () => {
      const response = await client.scanSheet.getAllScanSheets();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });
  });
});
