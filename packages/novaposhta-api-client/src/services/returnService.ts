/**
 * Return order service for Nova Poshta API
 * Handles all return order operations using AdditionalServiceGeneral model
 */

import type { HttpTransport } from '../http/transport';
import type { ClientContext } from '../core/client';
import { toHttpTransport } from '../core/client';
import type {
  GetReturnOrdersListRequest,
  GetReturnOrdersListResponse,
  CheckPossibilityCreateReturnRequest,
  CheckPossibilityCreateReturnResponse,
  CreateReturnFullRequest,
  CreateReturnResponse,
  UpdateReturnRequest,
  UpdateReturnResponse,
  CreateReturnToSenderAddressRequest,
  CreateReturnToNewAddressRequest,
  CreateReturnToWarehouseRequest,
} from '../types/returns';
import type { NovaPoshtaRequest } from '../types/base';
import { NovaPoshtaModel, NovaPoshtaMethod } from '../types/enums';
import { ReturnOrderType } from '../types/returns';

/**
 * Service for managing return orders (AdditionalServiceGeneral model)
 *
 * @example
 * ```typescript
 * const client = createClient({ transport, baseUrl, apiKey })
 *   .use(new ReturnService());
 *
 * // Check if return is possible
 * const possibility = await client.return.checkPossibility({ Number: '20450520287825' });
 *
 * // Get list of return orders
 * const orders = await client.return.getList({ Page: '1', Limit: '50' });
 *
 * // Create return to sender address
 * const created = await client.return.createToSenderAddress({
 *   IntDocNumber: '20450520287825',
 *   PaymentMethod: 'Cash',
 *   Reason: 'reason-ref',
 *   SubtypeReason: 'subtype-ref',
 *   ReturnAddressRef: 'address-ref-from-checkPossibility',
 * });
 * ```
 */
export class ReturnService {
  readonly namespace = 'return' as const;
  private transport!: HttpTransport;
  private apiKey?: string;

  attach(ctx: ClientContext) {
    this.transport = toHttpTransport(ctx);
    this.apiKey = ctx.apiKey;
  }

  /**
   * Get list of return orders
   * Returns all return orders matching the filter criteria
   *
   * @param request - Filter parameters (all optional)
   * @returns List of return orders
   */
  async getList(request: GetReturnOrdersListRequest = {}): Promise<GetReturnOrdersListResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.AdditionalService,
      calledMethod: NovaPoshtaMethod.GetReturnOrdersList,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<GetReturnOrdersListResponse['data']>(apiRequest);
  }

  /**
   * Check if return order can be created for a document
   * Only available for sender clients
   *
   * @param request - Document number to check
   * @returns Available return addresses and payment options
   */
  async checkPossibility(request: CheckPossibilityCreateReturnRequest): Promise<CheckPossibilityCreateReturnResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.AdditionalService,
      calledMethod: NovaPoshtaMethod.CheckPossibilityCreateReturn,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<CheckPossibilityCreateReturnResponse['data']>(apiRequest);
  }

  /**
   * Create a return order to sender's original address
   * Uses address REF from checkPossibility response
   *
   * @param request - Return order details with ReturnAddressRef
   * @returns Created return order number and REF
   */
  async createToSenderAddress(
    request: Omit<CreateReturnToSenderAddressRequest, 'OrderType'>,
  ): Promise<CreateReturnResponse> {
    const fullRequest: CreateReturnToSenderAddressRequest = {
      ...request,
      OrderType: ReturnOrderType.CargoReturn,
    };

    return this.create(fullRequest);
  }

  /**
   * Create a return order to a new address
   * Requires settlement, street, and building information
   *
   * @param request - Return order details with address components
   * @returns Created return order number and REF
   */
  async createToNewAddress(request: Omit<CreateReturnToNewAddressRequest, 'OrderType'>): Promise<CreateReturnResponse> {
    const fullRequest: CreateReturnToNewAddressRequest = {
      ...request,
      OrderType: ReturnOrderType.CargoReturn,
    };

    return this.create(fullRequest);
  }

  /**
   * Create a return order to a warehouse
   * Uses warehouse REF from checkPossibility response
   *
   * @param request - Return order details with RecipientWarehouse
   * @returns Created return order number and REF
   */
  async createToWarehouse(request: Omit<CreateReturnToWarehouseRequest, 'OrderType'>): Promise<CreateReturnResponse> {
    const fullRequest: CreateReturnToWarehouseRequest = {
      ...request,
      OrderType: ReturnOrderType.CargoReturn,
    };

    return this.create(fullRequest);
  }

  /**
   * Create a return order with full parameters
   * Use this when you need complete control over all parameters
   *
   * @param request - Full return order request
   * @returns Created return order number and REF
   */
  async create(request: CreateReturnFullRequest): Promise<CreateReturnResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.AdditionalService,
      calledMethod: NovaPoshtaMethod.Save,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<CreateReturnResponse['data']>(apiRequest);
  }

  /**
   * Update an existing return order
   * Only works when order status is "Прийняте" (Accepted)
   *
   * @param request - Update parameters
   * @returns Updated order with pricing and delivery date
   */
  async update(request: UpdateReturnRequest): Promise<UpdateReturnResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.AdditionalService,
      calledMethod: NovaPoshtaMethod.Update,
      methodProperties: request as unknown as Record<string, unknown>,
    };

    return await this.transport.request<UpdateReturnResponse['data']>(apiRequest);
  }

  /**
   * Get pricing information for a return order without updating
   * Convenience method that sets OnlyGetPricing: true
   *
   * @param request - Return order details
   * @returns Pricing and delivery date information
   */
  async getPricing(request: Omit<UpdateReturnRequest, 'OnlyGetPricing'>): Promise<UpdateReturnResponse> {
    return this.update({
      ...request,
      OnlyGetPricing: true,
    });
  }

  // =============================================================================
  // CONVENIENCE METHODS
  // =============================================================================

  /**
   * Get return order by number
   * Convenience method to find a specific return order
   *
   * @param orderNumber - Return order number (e.g., "102-00003168")
   * @returns Return order data or null if not found
   */
  async getByNumber(orderNumber: string): Promise<GetReturnOrdersListResponse['data'][number] | null> {
    const response = await this.getList({ Number: orderNumber });

    if (!response.success || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  }

  /**
   * Get return order by REF
   * Convenience method to find a specific return order by its REF
   *
   * @param ref - Return order REF identifier
   * @returns Return order data or null if not found
   */
  async getByRef(ref: string): Promise<GetReturnOrdersListResponse['data'][number] | null> {
    const response = await this.getList({ Ref: ref });

    if (!response.success || response.data.length === 0) {
      return null;
    }

    return response.data[0];
  }

  /**
   * Get return orders for a date range
   * Convenience method for filtering by dates
   *
   * @param beginDate - Start date (format: dd.mm.yyyy)
   * @param endDate - End date (format: dd.mm.yyyy)
   * @param options - Additional pagination options
   * @returns List of return orders in the date range
   */
  async getByDateRange(
    beginDate: string,
    endDate: string,
    options: { page?: string; limit?: string } = {},
  ): Promise<GetReturnOrdersListResponse> {
    return this.getList({
      BeginDate: beginDate,
      EndDate: endDate,
      ...options,
    });
  }

  // =============================================================================
  // LEGACY COMPATIBILITY METHODS
  // =============================================================================

  /**
   * Get return orders list (legacy method for compatibility)
   * @deprecated Use getList() method instead
   */
  async getReturnOrdersList(request: GetReturnOrdersListRequest = {}): Promise<GetReturnOrdersListResponse> {
    return this.getList(request);
  }

  /**
   * Check possibility to create return (legacy method for compatibility)
   * @deprecated Use checkPossibility() method instead
   */
  async checkPossibilityCreateReturn(
    request: CheckPossibilityCreateReturnRequest,
  ): Promise<CheckPossibilityCreateReturnResponse> {
    return this.checkPossibility(request);
  }

  /**
   * Save return order (legacy method for compatibility)
   * @deprecated Use create() or specific createTo* methods instead
   */
  async save(request: CreateReturnFullRequest): Promise<CreateReturnResponse> {
    return this.create(request);
  }
}
