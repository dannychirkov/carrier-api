/**
 * ScanSheet (Registry) types for Nova Poshta API
 * Handles registry/scan sheet operations for document processing
 *
 * Based on official Nova Poshta API documentation:
 * https://developers.novaposhta.ua/view/model/a46fc4f4-8512-11ec-8ced-005056b2dbe1
 *
 * IMPORTANT: Nova Poshta API always returns HTTP 200 even for logical errors.
 * Errors are returned inside data[].Errors or data[].Error fields.
 */

import type { NovaPoshtaRef, DocumentRef, NovaPoshtaResponse, NovaPoshtaDate } from './base';

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request to add documents to a scan sheet (insertDocuments)
 *
 * @example
 * {
 *   DocumentRefs: ['doc-ref-1', 'doc-ref-2'],
 *   Ref: 'existing-scan-sheet-ref', // optional
 *   Date: '01.01.2022' // optional
 * }
 */
export interface InsertDocumentsRequest {
  /** Array of document references to add to the scan sheet (required) */
  DocumentRefs: DocumentRef[];
  /** Ref of existing scan sheet (optional, creates new if not provided) */
  Ref?: NovaPoshtaRef;
  /** Date of the scan sheet in dd.mm.yyyy format (optional) */
  Date?: NovaPoshtaDate;
}

/**
 * Request to get scan sheet information (getScanSheet)
 *
 * @example
 * {
 *   Ref: 'scan-sheet-ref',
 *   CounterpartyRef: 'counterparty-ref'
 * }
 */
export interface GetScanSheetRequest {
  /** Scan sheet reference (required) */
  Ref: NovaPoshtaRef;
  /** Counterparty reference (required) */
  CounterpartyRef: NovaPoshtaRef;
}

/**
 * Request to get list of scan sheets (getScanSheetList)
 * According to docs, methodProperties can be empty
 */
export interface GetScanSheetListRequest {
  /** Page number for pagination (optional, not in official docs but commonly used) */
  Page?: number;
  /** Number of items per page (optional) */
  Limit?: number;
}

/**
 * Request to delete scan sheets (deleteScanSheet)
 *
 * @example
 * {
 *   ScanSheetRefs: ['scan-sheet-ref-1', 'scan-sheet-ref-2']
 * }
 */
export interface DeleteScanSheetRequest {
  /** Array of scan sheet references to delete (required) */
  ScanSheetRefs: NovaPoshtaRef[];
}

/**
 * Request to remove documents from scan sheet (removeDocuments)
 *
 * @example
 * {
 *   DocumentRefs: ['doc-ref-1', 'doc-ref-2'],
 *   Ref: 'scan-sheet-ref'
 * }
 */
export interface RemoveDocumentsRequest {
  /** Document references to remove (required) */
  DocumentRefs: DocumentRef[];
  /** Scan sheet reference (required according to docs) */
  Ref: NovaPoshtaRef;
}

/**
 * Request to print/generate scan sheet report
 */
export interface PrintScanSheetRequest {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Type of report (optional) */
  Type?: string;
}

// ============================================================================
// Response Data Types (matching official Nova Poshta API documentation)
// ============================================================================

/**
 * Success item in insertDocuments response
 */
export interface InsertDocumentsSuccessItem {
  /** Document reference */
  Ref: DocumentRef;
  /** Document number (e.g., "20450733330073") */
  Number: string;
}

/**
 * Error item in insertDocuments response
 */
export interface InsertDocumentsErrorItem {
  /** Document reference (may be empty) */
  Ref: string;
  /** Error description */
  Error: string;
}

/**
 * Nested data object in insertDocuments response
 */
export interface InsertDocumentsNestedData {
  /** Array of errors for documents that couldn't be added */
  Errors: InsertDocumentsErrorItem[];
  /** Array of successfully added documents */
  Success: InsertDocumentsSuccessItem[];
  /** Warnings */
  Warnings: string[];
}

/**
 * Result of inserting documents into scan sheet (insertDocuments)
 *
 * Response fields from API:
 * - Description: Registry name (if specified during creation)
 * - Ref: Document identifier
 * - Number: Registry number
 * - Date: Registry date
 * - Errors: Array of logical errors
 * - Warnings: Array of additional error info
 * - Data: Object with info about documents that couldn't be added
 * - Success: Array of successfully added documents
 */
export interface InsertDocumentsData {
  /** Registry name (if specified during creation) */
  Description?: string;
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Registry number (e.g., "105-00003134") */
  Number: string;
  /** Registry date (e.g., "01.01.2022") */
  Date: string;
  /** Array of logical errors */
  Errors: string[];
  /** Array of additional warnings */
  Warnings: string[];
  /** Object with info about documents that couldn't be added (null if all succeeded) */
  Data: InsertDocumentsNestedData | null;
  /** Array of successfully added documents */
  Success: InsertDocumentsSuccessItem[];
}

/**
 * Scan sheet data from getScanSheet
 *
 * Response fields from API:
 * - Ref: Identifier
 * - Number: Registry number
 * - DateTime: Creation date
 * - Count: Number of documents in registry
 * - CitySenderRef: Sender city REF
 * - CitySender: Sender city text description
 * - SenderAddressRef: Sender address REF
 * - SenderAddress: Sender address text description
 * - SenderRef: Sender counterparty REF
 * - Sender: Sender counterparty text description
 */
export interface ScanSheetData {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Registry number (e.g., "105-00003134") */
  Number: string;
  /** Creation date (e.g., "2015-03-20T13:45:19+00:00") */
  DateTime: string;
  /** Number of documents in registry */
  Count: string;
  /** Sender city reference */
  CitySenderRef: NovaPoshtaRef;
  /** Sender city text description (e.g., "Київ") */
  CitySender: string;
  /** Sender address reference */
  SenderAddressRef: NovaPoshtaRef;
  /** Sender address text description */
  SenderAddress: string;
  /** Sender counterparty reference */
  SenderRef: NovaPoshtaRef;
  /** Sender counterparty text description (e.g., "CBS-369138") */
  Sender: string;
}

/**
 * Scan sheet list item from getScanSheetList
 *
 * Response fields from API:
 * - Ref: Address REF (scan sheet identifier)
 * - Number: Registry number
 * - DateTime: Creation date
 * - Printed: Print flag (1 = printed, 0 = not printed)
 */
export interface ScanSheetListItem {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Registry number (e.g., "105-00003134") */
  Number: string;
  /** Creation date (e.g., "2021-03-20T13:45:19+00:00") */
  DateTime: string;
  /** Print flag: "1" = printed, "0" = not printed */
  Printed: string;
}

/**
 * Result of deleting scan sheet (deleteScanSheet)
 *
 * Response fields from API:
 * - Ref: Deleted registry REF
 * - Number: Deleted registry number REF
 * - Error: Error message if deletion failed
 */
export interface DeleteScanSheetData {
  /** Deleted scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Deleted scan sheet number (can be REF format) */
  Number: string;
  /** Error message if deletion failed (e.g., "ScanSheet is invalid") */
  Error?: string;
}

/**
 * Success item in removeDocuments response
 */
export interface RemoveDocumentsSuccessItem {
  /** Document reference */
  Ref: DocumentRef;
  /** Document number (e.g., "20450123456789") */
  Number: string;
  /** Registry reference from which document was removed */
  Document: NovaPoshtaRef;
}

/**
 * DocumentRefs object in removeDocuments response
 */
export interface RemoveDocumentsResultData {
  /** Array of errors */
  Errors: string[];
  /** Array of successfully removed documents */
  Success: RemoveDocumentsSuccessItem[];
}

/**
 * Result of removing documents from scan sheet (removeDocuments)
 *
 * Response structure:
 * {
 *   "DocumentRefs": {
 *     "Errors": [],
 *     "Success": [{ "Ref": "...", "Number": "...", "Document": "..." }]
 *   }
 * }
 */
export interface RemoveDocumentsData {
  /** Result of document removal operation */
  DocumentRefs: RemoveDocumentsResultData;
}

/**
 * Document in scan sheet data (for internal use)
 */
export interface ScanSheetDocumentData {
  /** Document reference */
  Ref: DocumentRef;
  /** Document number */
  IntDocNumber: string;
  /** Document description */
  Description?: string;
  /** Estimated weight */
  Weight?: number;
  /** Seats amount */
  SeatsAmount?: number;
  /** Cost */
  Cost?: number;
}

/**
 * Print form data
 */
export interface PrintFormData {
  /** Link to the print form */
  PrintForm: string;
  /** Document format (PDF, HTML, etc.) */
  Format?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Response for inserting documents
 * Note: data is always an array with one element
 */
export type InsertDocumentsResponse = NovaPoshtaResponse<InsertDocumentsData[]>;

/**
 * Response for getting scan sheet
 * Note: data is always an array with one element
 */
export type GetScanSheetResponse = NovaPoshtaResponse<ScanSheetData[]>;

/**
 * Response for getting scan sheet list
 */
export type GetScanSheetListResponse = NovaPoshtaResponse<ScanSheetListItem[]>;

/**
 * Response for deleting scan sheet
 * Note: data is always an array
 */
export type DeleteScanSheetResponse = NovaPoshtaResponse<DeleteScanSheetData[]>;

/**
 * Response for removing documents
 * Note: data is always an array with one element
 */
export type RemoveDocumentsResponse = NovaPoshtaResponse<RemoveDocumentsData[]>;

/**
 * Response for print form
 */
export type PrintScanSheetResponse = NovaPoshtaResponse<PrintFormData[]>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if scan sheet is empty
 */
export function isScanSheetEmpty(scanSheet: ScanSheetData): boolean {
  const count = parseInt(scanSheet.Count, 10);
  return isNaN(count) || count === 0;
}

/**
 * Check if scan sheet has been printed
 */
export function isScanSheetPrinted(scanSheet: ScanSheetListItem): boolean {
  return scanSheet.Printed === '1';
}

/**
 * Check if insertDocuments response has errors
 * Since API always returns success: true, check for errors in data
 */
export function hasInsertErrors(data: InsertDocumentsData): boolean {
  if (data.Errors && data.Errors.length > 0) {
    return true;
  }
  if (data.Data && data.Data.Errors && data.Data.Errors.length > 0) {
    return true;
  }
  return false;
}

/**
 * Check if deleteScanSheet response has error
 */
export function hasDeleteError(data: DeleteScanSheetData): boolean {
  return data.Error !== undefined && data.Error !== '';
}

/**
 * Check if removeDocuments response has errors
 */
export function hasRemoveErrors(data: RemoveDocumentsData): boolean {
  if (!data.DocumentRefs) {
    return false;
  }
  return data.DocumentRefs.Errors && data.DocumentRefs.Errors.length > 0;
}

/**
 * Validate document refs array
 */
export function validateDocumentRefs(documentRefs: DocumentRef[]): boolean {
  if (!Array.isArray(documentRefs) || documentRefs.length === 0) {
    return false;
  }

  return documentRefs.every(ref => {
    return typeof ref === 'string' && ref.length > 0;
  });
}

/**
 * Validate scan sheet ref
 */
export function validateScanSheetRef(ref: NovaPoshtaRef): boolean {
  return typeof ref === 'string' && ref.length > 0;
}
