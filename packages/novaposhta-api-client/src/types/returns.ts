/**
 * Types for return order operations (AdditionalServiceGeneral model)
 * Based on Nova Poshta API documentation for return orders
 */

import type {
  NovaPoshtaResponse,
  NovaPoshtaRef,
  String36,
  String100,
  NovaPoshtaDateTime,
  SettlementRef,
  WarehouseRef,
  StreetRef,
  Cost,
  PhoneNumber,
} from './base';
import { PaymentMethod } from './enums';

// ============================================================================
// Enums specific to returns
// ============================================================================

/**
 * Order type for return operations
 */
export enum ReturnOrderType {
  /** Cargo return order */
  CargoReturn = 'orderCargoReturn',
}

/**
 * Return order status
 */
export enum ReturnOrderStatus {
  /** Order accepted */
  Accepted = 'Прийняте',
  /** Order in progress */
  InProgress = 'В обробці',
  /** Order completed */
  Completed = 'Виконано',
  /** Order cancelled */
  Cancelled = 'Скасовано',
}

// ============================================================================
// Get Return Orders List
// ============================================================================

/**
 * Request parameters for getReturnOrdersList method
 * All parameters are optional - returns all orders if empty
 */
export interface GetReturnOrdersListRequest {
  /** Return order number (e.g., "102-00003168") */
  readonly Number?: String36;
  /** Return order REF identifier */
  readonly Ref?: NovaPoshtaRef;
  /** Start date for filtering (format: dd.mm.yyyy) */
  readonly BeginDate?: String36;
  /** End date for filtering (format: dd.mm.yyyy) */
  readonly EndDate?: String36;
  /** Page number for pagination */
  readonly Page?: string;
  /** Items per page limit */
  readonly Limit?: string;
}

/**
 * Return order data from the list response
 */
export interface ReturnOrderData {
  /** Return order REF identifier */
  readonly OrderRef: NovaPoshtaRef;
  /** Return order number */
  readonly OrderNumber: String36;
  /** Return order status */
  readonly OrderStatus: string;
  /** Original document number (waybill) */
  readonly DocumentNumber: String36;
  /** Recipient counterparty for return waybill */
  readonly CounterpartyRecipient: String36;
  /** Contact person for return waybill recipient */
  readonly ContactPersonRecipient: String36;
  /** Address for return waybill delivery */
  readonly AddressRecipient: String36;
  /** Return waybill delivery cost (if created) */
  readonly DeliveryCost: string;
  /** Estimated delivery date for return (if waybill created) */
  readonly EstimatedDeliveryDate: NovaPoshtaDateTime;
  /** Return express waybill number (if created) */
  readonly ExpressWaybillNumber: String36;
  /** Return express waybill status (if created) */
  readonly ExpressWaybillStatus: String36;
}

export type GetReturnOrdersListResponse = NovaPoshtaResponse<readonly ReturnOrderData[]>;

// ============================================================================
// Check Possibility Create Return
// ============================================================================

/**
 * Request parameters for CheckPossibilityCreateReturn method
 * Only available for sender clients
 */
export interface CheckPossibilityCreateReturnRequest {
  /** Document (waybill) number - REQUIRED */
  readonly Number: String36;
}

/**
 * Return possibility data with available recipient addresses
 */
export interface ReturnPossibilityData {
  /** Whether non-cash payment is available */
  readonly NonCash: boolean;
  /** Recipient city name */
  readonly City: String36;
  /** Recipient counterparty name */
  readonly Counterparty: String36;
  /** Recipient contact person */
  readonly ContactPerson: String36;
  /** Recipient address */
  readonly Address: String100;
  /** Recipient phone */
  readonly Phone: PhoneNumber;
  /** Block identifier (used for ReturnAddressRef) */
  readonly Ref: NovaPoshtaRef;
}

export type CheckPossibilityCreateReturnResponse = NovaPoshtaResponse<readonly ReturnPossibilityData[]>;

// ============================================================================
// Create Return Order (save method)
// ============================================================================

/**
 * Base properties for creating a return order
 */
interface BaseCreateReturnRequest {
  /** Original document (waybill) number - REQUIRED */
  readonly IntDocNumber: String36;
  /** Payment method (Cash/NonCash) - REQUIRED */
  readonly PaymentMethod: PaymentMethod | 'Cash' | 'NonCash';
  /** Return reason REF identifier - REQUIRED */
  readonly Reason: NovaPoshtaRef;
  /** Return reason subtype REF identifier - REQUIRED */
  readonly SubtypeReason: NovaPoshtaRef;
  /** Additional notes (optional) */
  readonly Note?: String100;
  /** Order type - always 'orderCargoReturn' - REQUIRED */
  readonly OrderType: ReturnOrderType | 'orderCargoReturn';
}

/**
 * Create return to sender's address
 * Uses address from CheckPossibilityCreateReturn response
 */
export interface CreateReturnToSenderAddressRequest extends BaseCreateReturnRequest {
  /** Sender address REF from CheckPossibilityCreateReturn response - REQUIRED */
  readonly ReturnAddressRef: NovaPoshtaRef;
}

/**
 * Create return to new address
 * Requires settlement, street, and building details
 */
export interface CreateReturnToNewAddressRequest extends BaseCreateReturnRequest {
  /** Recipient settlement REF - REQUIRED */
  readonly RecipientSettlement: SettlementRef;
  /** Recipient street REF - REQUIRED */
  readonly RecipientSettlementStreet: StreetRef;
  /** Building number - REQUIRED */
  readonly BuildingNumber: String36;
  /** Address note (apartment, floor, entrance, etc.) */
  readonly NoteAddressRecipient?: String36;
}

/**
 * Create return to warehouse
 * Uses warehouse REF from CheckPossibilityCreateReturn response
 */
export interface CreateReturnToWarehouseRequest extends BaseCreateReturnRequest {
  /** Warehouse REF for return - REQUIRED */
  readonly RecipientWarehouse: WarehouseRef;
}

/**
 * Union type for all create return request variants
 */
export type CreateReturnRequest =
  | CreateReturnToSenderAddressRequest
  | CreateReturnToNewAddressRequest
  | CreateReturnToWarehouseRequest;

/**
 * Full create return request with all possible parameters
 * Some parameters are mutually exclusive depending on return type
 */
export interface CreateReturnFullRequest extends BaseCreateReturnRequest {
  /** Sender address REF (for return to sender address) */
  readonly ReturnAddressRef?: NovaPoshtaRef;
  /** Recipient settlement REF (for return to new address) */
  readonly RecipientSettlement?: SettlementRef;
  /** Recipient street REF (for return to new address) */
  readonly RecipientSettlementStreet?: StreetRef;
  /** Building number (for return to new address) */
  readonly BuildingNumber?: String36;
  /** Address note (for return to new address) */
  readonly NoteAddressRecipient?: String36;
  /** Warehouse REF (for return to warehouse) */
  readonly RecipientWarehouse?: WarehouseRef;
}

/**
 * Response data after creating a return order
 */
export interface CreateReturnData {
  /** Created return order number */
  readonly Number: String36;
  /** Created return order REF identifier */
  readonly Ref: NovaPoshtaRef;
}

export type CreateReturnResponse = NovaPoshtaResponse<readonly CreateReturnData[]>;

// ============================================================================
// Update Return Order
// ============================================================================

/**
 * Request parameters for updating an existing return order
 * Only editable when OrderStatus = "Прийняте" (Accepted)
 */
export interface UpdateReturnRequest {
  /** Return order REF to update - REQUIRED */
  readonly Ref: NovaPoshtaRef;
  /** Original document number - REQUIRED */
  readonly IntDocNumber: String36;
  /** Payment method - REQUIRED */
  readonly PaymentMethod: PaymentMethod | 'Cash' | 'NonCash';
  /** Order type (always orderCargoReturn) - REQUIRED */
  readonly OrderType: ReturnOrderType | 'orderCargoReturn';
  /** Return reason REF - REQUIRED */
  readonly Reason: NovaPoshtaRef;
  /** Return reason subtype REF - REQUIRED */
  readonly SubtypeReason: NovaPoshtaRef;
  /** Only get pricing info without updating (1 = true, 0 = false) */
  readonly OnlyGetPricing?: boolean;
  /** New settlement REF (for changing to new address) */
  readonly RecipientSettlement?: SettlementRef;
  /** New warehouse REF (for changing to warehouse) */
  readonly RecipientWarehouse?: WarehouseRef;
  /** New street REF (for changing to new address) */
  readonly RecipientSettlementStreet?: StreetRef;
  /** New building number (for changing to new address) */
  readonly BuildingNumber?: String36;
  /** Address note (apartment, floor, etc.) */
  readonly NoteAddressRecipient?: String36;
}

/**
 * Service pricing information
 */
export interface PricingService {
  /** Service name (e.g., "Повернення посилки") */
  readonly Service: string;
  /** Service cost */
  readonly Cost: Cost;
}

/**
 * Pricing details for return order
 */
export interface ReturnPricing {
  /** Array of service costs */
  readonly Services: readonly PricingService[];
  /** Total cost */
  readonly Total: Cost;
  /** First day storage date */
  readonly FirstDayStorage: NovaPoshtaDateTime;
}

/**
 * Response data after updating a return order
 */
export interface UpdateReturnData {
  /** Scheduled delivery date and time */
  readonly ScheduledDeliveryDate: NovaPoshtaDateTime;
  /** Pricing details */
  readonly Pricing: ReturnPricing;
}

export type UpdateReturnResponse = NovaPoshtaResponse<readonly UpdateReturnData[]>;

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Check if return order can be edited
 */
export function isReturnOrderEditable(status: string): boolean {
  return status === ReturnOrderStatus.Accepted || status === 'Прийняте';
}

/**
 * Check if request is for return to sender address
 */
export function isReturnToSenderAddress(request: CreateReturnRequest): request is CreateReturnToSenderAddressRequest {
  return 'ReturnAddressRef' in request && request.ReturnAddressRef !== undefined;
}

/**
 * Check if request is for return to new address
 */
export function isReturnToNewAddress(request: CreateReturnRequest): request is CreateReturnToNewAddressRequest {
  return (
    'RecipientSettlement' in request &&
    'RecipientSettlementStreet' in request &&
    'BuildingNumber' in request &&
    request.RecipientSettlement !== undefined
  );
}

/**
 * Check if request is for return to warehouse
 */
export function isReturnToWarehouse(request: CreateReturnRequest): request is CreateReturnToWarehouseRequest {
  return 'RecipientWarehouse' in request && request.RecipientWarehouse !== undefined;
}
