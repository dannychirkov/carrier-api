/**
 * ScanSheet service for Nova Poshta API
 * Handles all scan sheet (registry) related operations
 */

import type { HttpTransport } from '../http/transport';
import type { ClientContext } from '../core/client';
import { toHttpTransport } from '../core/client';
import type {
  InsertDocumentsRequest,
  GetScanSheetRequest,
  GetScanSheetListRequest,
  DeleteScanSheetRequest,
  RemoveDocumentsRequest,
  PrintScanSheetRequest,
  InsertDocumentsResponse,
  GetScanSheetResponse,
  GetScanSheetListResponse,
  DeleteScanSheetResponse,
  RemoveDocumentsResponse,
  PrintScanSheetResponse,
} from '../types/scanSheet';
import type { NovaPoshtaRequest } from '../types/base';
import { NovaPoshtaModel, NovaPoshtaMethod } from '../types/enums';

/**
 * Service for managing scan sheets (registries)
 *
 * Scan sheets are used for batch processing and tracking of multiple shipments.
 * They serve as registries for accepting and transferring shipments.
 */
export class ScanSheetService {
  readonly namespace = 'scanSheet' as const;
  private transport!: HttpTransport;
  private apiKey?: string;

  attach(ctx: ClientContext) {
    this.transport = toHttpTransport(ctx);
    this.apiKey = ctx.apiKey;
  }

  /**
   * Add documents to a scan sheet
   * If no Ref is provided, creates a new scan sheet
   *
   * @example
   * ```typescript
   * // Create new scan sheet with documents
   * const result = await client.scanSheet.insertDocuments({
   *   DocumentRefs: ['doc-ref-1', 'doc-ref-2', 'doc-ref-3']
   * });
   *
   * // Add documents to existing scan sheet
   * const result = await client.scanSheet.insertDocuments({
   *   Ref: 'scan-sheet-ref',
   *   DocumentRefs: ['doc-ref-4', 'doc-ref-5']
   * });
   * ```
   */
  async insertDocuments(request: InsertDocumentsRequest): Promise<InsertDocumentsResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.InsertDocuments,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<InsertDocumentsResponse['data']>(apiRequest);
  }

  /**
   * Get detailed information about a scan sheet
   *
   * @example
   * ```typescript
   * const scanSheet = await client.scanSheet.getScanSheet({
   *   Ref: 'scan-sheet-ref',
   *   CounterpartyRef: 'counterparty-ref'
   * });
   * console.log('Documents in scan sheet:', scanSheet.data[0].Count);
   * ```
   */
  async getScanSheet(request: GetScanSheetRequest): Promise<GetScanSheetResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.GetScanSheet,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<GetScanSheetResponse['data']>(apiRequest);
  }

  /**
   * Get list of scan sheets with pagination
   *
   * @example
   * ```typescript
   * const scanSheets = await client.scanSheet.getScanSheetList({
   *   Page: 1,
   *   Limit: 50
   * });
   * console.log('Total scan sheets:', scanSheets.data.length);
   * ```
   */
  async getScanSheetList(request: GetScanSheetListRequest = {}): Promise<GetScanSheetListResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.GetScanSheetList,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<GetScanSheetListResponse['data']>(apiRequest);
  }

  /**
   * Delete one or multiple scan sheets
   *
   * @example
   * ```typescript
   * const result = await client.scanSheet.deleteScanSheet({
   *   ScanSheetRefs: ['scan-sheet-ref-1', 'scan-sheet-ref-2']
   * });
   * ```
   */
  async deleteScanSheet(request: DeleteScanSheetRequest): Promise<DeleteScanSheetResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.DeleteScanSheet,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<DeleteScanSheetResponse['data']>(apiRequest);
  }

  /**
   * Remove specific documents from a scan sheet
   *
   * @example
   * ```typescript
   * const result = await client.scanSheet.removeDocuments({
   *   Ref: 'scan-sheet-ref',
   *   DocumentRefs: ['doc-ref-1', 'doc-ref-2']
   * });
   * console.log('Documents removed:', result.data[0].DocumentRefs.Success.length);
   * ```
   */
  async removeDocuments(request: RemoveDocumentsRequest): Promise<RemoveDocumentsResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.RemoveDocuments,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<RemoveDocumentsResponse['data']>(apiRequest);
  }

  /**
   * Get print form for a scan sheet
   *
   * @example
   * ```typescript
   * const printForm = await client.scanSheet.printScanSheet({
   *   Ref: 'scan-sheet-ref'
   * });
   * console.log('Print form URL:', printForm.data[0].PrintForm);
   * ```
   */
  async printScanSheet(request: PrintScanSheetRequest): Promise<PrintScanSheetResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ScanSheet,
      calledMethod: NovaPoshtaMethod.PrintScanSheet,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<PrintScanSheetResponse['data']>(apiRequest);
  }

  // =============================================================================
  // Convenience Methods
  // =============================================================================

  /**
   * Create a new scan sheet with documents
   * Convenience method for insertDocuments without Ref
   */
  async createScanSheet(documentRefs: string[]): Promise<InsertDocumentsResponse> {
    return this.insertDocuments({ DocumentRefs: documentRefs as any });
  }

  /**
   * Add documents to an existing scan sheet
   * Convenience method for insertDocuments with Ref
   */
  async addDocuments(scanSheetRef: string, documentRefs: string[]): Promise<InsertDocumentsResponse> {
    return this.insertDocuments({
      Ref: scanSheetRef as any,
      DocumentRefs: documentRefs as any,
    });
  }

  /**
   * Delete a single scan sheet
   * Convenience method for deleteScanSheet with single ref
   */
  async deleteSingle(scanSheetRef: string): Promise<DeleteScanSheetResponse> {
    return this.deleteScanSheet({ ScanSheetRefs: [scanSheetRef as any] });
  }

  /**
   * Get all scan sheets (fetches all pages)
   */
  async getAllScanSheets(): Promise<GetScanSheetListResponse> {
    const allScanSheets: any[] = [];
    let page = 1;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getScanSheetList({ Page: page, Limit: limit });

      if (response.success && response.data && response.data.length > 0) {
        allScanSheets.push(...response.data);
        hasMore = response.data.length === limit;
        page++;
      } else {
        hasMore = false;
      }
    }

    return {
      success: true,
      data: allScanSheets,
      errors: [],
      warnings: [],
      info: [],
      messageCodes: [],
      errorCodes: [],
      warningCodes: [],
      infoCodes: [],
    };
  }
}
