import { createClient } from '../../src/core/client';
import { ScanSheetService } from '../../src/services/scanSheetService';
import { createMockTransport } from '../mocks/transport';

describe('ScanSheetService', () => {
  const baseUrl = 'https://api.novaposhta.ua/v2.0/json/';
  const apiKey = 'test-api-key';

  describe('insertDocuments', () => {
    it('should create new scan sheet with documents', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          Number: '100500',
          DateTime: '01.01.2024 12:00:00',
          DocumentsCount: 3,
          DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3'],
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.insertDocuments({
        DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3'] as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].url).toBe(baseUrl);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'insertDocuments',
        methodProperties: {
          DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3'],
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should add documents to existing scan sheet', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          Number: '100500',
          DateTime: '01.01.2024 12:00:00',
          DocumentsCount: 5,
          DocumentRefs: ['doc-ref-4', 'doc-ref-5'],
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.insertDocuments({
        Ref: 'scan-sheet-ref-1' as any,
        DocumentRefs: ['doc-ref-4', 'doc-ref-5'] as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'insertDocuments',
        methodProperties: {
          Ref: 'scan-sheet-ref-1',
          DocumentRefs: ['doc-ref-4', 'doc-ref-5'],
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getScanSheet', () => {
    it('should get scan sheet by ref', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          Number: '100500',
          DateTime: '01.01.2024 12:00:00',
          Description: 'Test Scan Sheet',
          DocumentsCount: 10,
          Status: 'Active',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.getScanSheet({
        Ref: 'scan-sheet-ref-1' as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'getScanSheet',
        methodProperties: {
          Ref: 'scan-sheet-ref-1',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getScanSheetList', () => {
    it('should get list of scan sheets with pagination', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          Number: '100500',
          DateTime: '01.01.2024 12:00:00',
          DocumentsCount: 10,
          Status: 'Active',
        },
        {
          Ref: 'scan-sheet-ref-2',
          Number: '100501',
          DateTime: '02.01.2024 12:00:00',
          DocumentsCount: 5,
          Status: 'Active',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.getScanSheetList({
        Page: 1,
        Limit: 50,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'getScanSheetList',
        methodProperties: {
          Page: 1,
          Limit: 50,
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should get list with default parameters when none provided', async () => {
      const mockData = [];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.getScanSheetList();

      expect(calls).toHaveLength(1);
      expect(calls[0].body.modelName).toBe('ScanSheetGeneral');
      expect(calls[0].body.calledMethod).toBe('getScanSheetList');
      expect(result.success).toBe(true);
    });
  });

  describe('deleteScanSheet', () => {
    it('should delete scan sheets by refs', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          Message: 'Deleted successfully',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.deleteScanSheet({
        ScanSheetRefs: ['scan-sheet-ref-1', 'scan-sheet-ref-2'] as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'deleteScanSheet',
        methodProperties: {
          ScanSheetRefs: ['scan-sheet-ref-1', 'scan-sheet-ref-2'],
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('removeDocuments', () => {
    it('should remove documents from scan sheet', async () => {
      const mockData = [
        {
          Ref: 'scan-sheet-ref-1',
          DocumentsRemoved: 2,
          RemainingDocuments: 8,
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.removeDocuments({
        Ref: 'scan-sheet-ref-1' as any,
        DocumentRefs: ['doc-ref-1', 'doc-ref-2'] as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'removeDocuments',
        methodProperties: {
          Ref: 'scan-sheet-ref-1',
          DocumentRefs: ['doc-ref-1', 'doc-ref-2'],
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('printScanSheet', () => {
    it('should get print form for scan sheet', async () => {
      const mockData = [
        {
          PrintForm: 'https://novaposhta.ua/print/scansheet/12345',
          Format: 'PDF',
        },
      ];
      const { transport, calls, setResponse } = createMockTransport();
      setResponse({ success: true, data: mockData });

      const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

      const result = await client.scanSheet.printScanSheet({
        Ref: 'scan-sheet-ref-1' as any,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].body).toMatchObject({
        modelName: 'ScanSheetGeneral',
        calledMethod: 'printScanSheet',
        methodProperties: {
          Ref: 'scan-sheet-ref-1',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });
  });

  describe('convenience methods', () => {
    describe('createScanSheet', () => {
      it('should create new scan sheet using convenience method', async () => {
        const mockData = [
          {
            Ref: 'scan-sheet-ref-1',
            Number: '100500',
            DateTime: '01.01.2024 12:00:00',
            DocumentsCount: 3,
            DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3'],
          },
        ];
        const { transport, calls, setResponse } = createMockTransport();
        setResponse({ success: true, data: mockData });

        const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

        const result = await client.scanSheet.createScanSheet(['doc-ref-1', 'doc-ref-2', 'doc-ref-3']);

        expect(calls).toHaveLength(1);
        expect(calls[0].body.methodProperties).toMatchObject({
          DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3'],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('addDocuments', () => {
      it('should add documents to existing scan sheet using convenience method', async () => {
        const mockData = [
          {
            Ref: 'scan-sheet-ref-1',
            Number: '100500',
            DateTime: '01.01.2024 12:00:00',
            DocumentsCount: 5,
            DocumentRefs: ['doc-ref-4', 'doc-ref-5'],
          },
        ];
        const { transport, calls, setResponse } = createMockTransport();
        setResponse({ success: true, data: mockData });

        const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

        const result = await client.scanSheet.addDocuments('scan-sheet-ref-1', ['doc-ref-4', 'doc-ref-5']);

        expect(calls).toHaveLength(1);
        expect(calls[0].body.methodProperties).toMatchObject({
          Ref: 'scan-sheet-ref-1',
          DocumentRefs: ['doc-ref-4', 'doc-ref-5'],
        });
        expect(result.success).toBe(true);
      });
    });

    describe('deleteSingle', () => {
      it('should delete single scan sheet using convenience method', async () => {
        const mockData = [
          {
            Ref: 'scan-sheet-ref-1',
            Message: 'Deleted successfully',
          },
        ];
        const { transport, calls, setResponse } = createMockTransport();
        setResponse({ success: true, data: mockData });

        const client = createClient({ transport, baseUrl, apiKey }).use(new ScanSheetService());

        const result = await client.scanSheet.deleteSingle('scan-sheet-ref-1');

        expect(calls).toHaveLength(1);
        expect(calls[0].body.methodProperties).toMatchObject({
          ScanSheetRefs: ['scan-sheet-ref-1'],
        });
        expect(result.success).toBe(true);
      });
    });
  });
});
