/**
 * ScanSheet (Registry) types for Nova Poshta API
 * Handles registry/scan sheet operations for document processing
 */

import type {
  NovaPoshtaRef,
  DocumentRef,
  NovaPoshtaResponse,
  NovaPoshtaDate,
  String100,
} from './base';

// ============================================================================
// Request Types
// ============================================================================

/**
 * Request to add documents to a scan sheet
 */
export interface InsertDocumentsRequest {
  /** Document references to add to the scan sheet */
  DocumentRefs: DocumentRef[];
  /** Ref of existing scan sheet (optional, creates new if not provided) */
  Ref?: NovaPoshtaRef;
  /** Date of the scan sheet */
  Date?: NovaPoshtaDate;
}

/**
 * Request to get scan sheet information
 */
export interface GetScanSheetRequest {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
}

/**
 * Request to get list of scan sheets
 */
export interface GetScanSheetListRequest {
  /** Page number for pagination */
  Page?: number;
  /** Number of items per page */
  Limit?: number;
}

/**
 * Request to delete a scan sheet
 */
export interface DeleteScanSheetRequest {
  /** Array of scan sheet references to delete */
  ScanSheetRefs: NovaPoshtaRef[];
}

/**
 * Request to remove documents from scan sheet
 */
export interface RemoveDocumentsRequest {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Document references to remove */
  DocumentRefs: DocumentRef[];
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
// Response Data Types
// ============================================================================

/**
 * Scan sheet data
 */
export interface ScanSheetData {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Scan sheet number */
  Number: string;
  /** Creation date */
  DateTime: string;
  /** Scan sheet description */
  Description?: string;
  /** Number of documents in the scan sheet */
  DocumentsCount?: number;
  /** Scan sheet status */
  Status?: string;
  /** Scan sheet print form link */
  PrintForm?: string;
}

/**
 * Document in scan sheet data
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
 * Scan sheet list item
 */
export interface ScanSheetListItem {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Scan sheet number */
  Number: string;
  /** Creation date */
  DateTime: string;
  /** Number of documents */
  DocumentsCount: number;
  /** Status */
  Status: string;
}

/**
 * Result of inserting documents into scan sheet
 */
export interface InsertDocumentsData {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Scan sheet number */
  Number: string;
  /** Creation date */
  DateTime: string;
  /** Number of documents added */
  DocumentsCount: number;
  /** List of added document refs */
  DocumentRefs: DocumentRef[];
}

/**
 * Result of removing documents from scan sheet
 */
export interface RemoveDocumentsData {
  /** Scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Number of documents removed */
  DocumentsRemoved: number;
  /** Remaining documents count */
  RemainingDocuments: number;
}

/**
 * Result of deleting scan sheet
 */
export interface DeleteScanSheetData {
  /** Deleted scan sheet reference */
  Ref: NovaPoshtaRef;
  /** Success message */
  Message?: string;
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
 */
export type InsertDocumentsResponse = NovaPoshtaResponse<InsertDocumentsData>;

/**
 * Response for getting scan sheet
 */
export type GetScanSheetResponse = NovaPoshtaResponse<ScanSheetData>;

/**
 * Response for getting scan sheet list
 */
export type GetScanSheetListResponse = NovaPoshtaResponse<ScanSheetListItem>;

/**
 * Response for deleting scan sheet
 */
export type DeleteScanSheetResponse = NovaPoshtaResponse<DeleteScanSheetData>;

/**
 * Response for removing documents
 */
export type RemoveDocumentsResponse = NovaPoshtaResponse<RemoveDocumentsData>;

/**
 * Response for print form
 */
export type PrintScanSheetResponse = NovaPoshtaResponse<PrintFormData>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if scan sheet is empty
 */
export function isScanSheetEmpty(scanSheet: ScanSheetData): boolean {
  return !scanSheet.DocumentsCount || scanSheet.DocumentsCount === 0;
}

/**
 * Check if scan sheet can be deleted
 */
export function canDeleteScanSheet(scanSheet: ScanSheetData): boolean {
  // Usually can delete if not yet processed/printed
  return !scanSheet.Status || scanSheet.Status !== 'Processed';
}

/**
 * Validate document refs array
 */
export function validateDocumentRefs(documentRefs: DocumentRef[]): boolean {
  if (!Array.isArray(documentRefs) || documentRefs.length === 0) {
    return false;
  }

  return documentRefs.every((ref) => {
    return typeof ref === 'string' && ref.length > 0;
  });
}

/**
 * Validate scan sheet ref
 */
export function validateScanSheetRef(ref: NovaPoshtaRef): boolean {
  return typeof ref === 'string' && ref.length > 0;
}
