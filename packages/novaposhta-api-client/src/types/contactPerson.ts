/**
 * Contact person service types for Nova Poshta API
 * Handles all contact person operations
 */

import type { NovaPoshtaResponse, ContactRef, CounterpartyRef } from './base';

// =============================================================================
// SAVE CONTACT PERSON
// =============================================================================

export interface SaveContactPersonRequest {
  readonly counterpartyRef: CounterpartyRef;
  readonly firstName: string;
  readonly middleName?: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email?: string;
}

export interface ContactPersonData {
  readonly Ref: ContactRef;
  readonly Description: string;
  readonly LastName: string;
  readonly FirstName: string;
  readonly MiddleName: string;
  readonly Phones: string;
  readonly Email: string;
}

export type SaveContactPersonResponse = NovaPoshtaResponse<ContactPersonData[]>;

// =============================================================================
// UPDATE CONTACT PERSON
// =============================================================================

export interface UpdateContactPersonRequest {
  readonly ref: ContactRef;
  readonly counterpartyRef: CounterpartyRef;
  readonly firstName?: string;
  readonly middleName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly email?: string;
}

export type UpdateContactPersonResponse = NovaPoshtaResponse<ContactPersonData[]>;

// =============================================================================
// DELETE CONTACT PERSON
// =============================================================================

export interface DeleteContactPersonRequest {
  readonly ref: ContactRef;
  readonly counterpartyRef: CounterpartyRef;
}

export interface DeleteContactPersonData {
  readonly Ref: ContactRef;
}

export type DeleteContactPersonResponse = NovaPoshtaResponse<DeleteContactPersonData[]>;

// =============================================================================
// AGGREGATE TYPES
// =============================================================================

export type ContactPersonRequest = SaveContactPersonRequest | UpdateContactPersonRequest | DeleteContactPersonRequest;

export type ContactPersonResponse =
  | SaveContactPersonResponse
  | UpdateContactPersonResponse
  | DeleteContactPersonResponse;
