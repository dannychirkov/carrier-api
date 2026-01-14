import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import type {
  GetReturnOrdersListRequest,
  CheckPossibilityCreateReturnRequest,
  CreateReturnFullRequest,
  UpdateReturnRequest,
} from '@shopana/novaposhta-api-client';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult } from '../utils/error-handler.js';
import { assertString, assertOptionalString, assertOptionalBoolean } from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';

const returnTools: Tool[] = [
  {
    name: 'return_get_list',
    description:
      'Get list of return orders via AdditionalServiceGeneral/getReturnOrdersList. Returns all return orders matching the filter criteria. Available for sender clients only. Cache hourly.',
    inputSchema: {
      type: 'object',
      properties: {
        Number: { type: 'string', description: 'Return order number (e.g., "102-00003168").' },
        Ref: { type: 'string', description: 'Return order REF identifier.' },
        BeginDate: { type: 'string', description: 'Start date for filtering (format: dd.mm.yyyy).' },
        EndDate: { type: 'string', description: 'End date for filtering (format: dd.mm.yyyy).' },
        Page: { type: 'string', description: 'Page number for pagination.' },
        Limit: { type: 'string', description: 'Items per page limit.' },
      },
      required: [],
    },
  },
  {
    name: 'return_check_possibility',
    description:
      'Check if return order can be created for a document via AdditionalServiceGeneral/CheckPossibilityCreateReturn. Returns available return addresses, payment options, and Ref identifiers needed for creating a return. Only available for sender clients.',
    inputSchema: {
      type: 'object',
      properties: {
        Number: {
          type: 'string',
          description: 'Document (waybill) number to check (e.g., "20450520287825"). REQUIRED.',
        },
      },
      required: ['Number'],
    },
  },
  {
    name: 'return_create_to_sender_address',
    description:
      "Create a return order to sender's original address via AdditionalServiceGeneral/save. Uses ReturnAddressRef from check_possibility response. Available for sender clients only.",
    inputSchema: {
      type: 'object',
      properties: {
        IntDocNumber: { type: 'string', description: 'Original document (waybill) number. REQUIRED.' },
        PaymentMethod: { type: 'string', description: 'Payment method: "Cash" or "NonCash". REQUIRED.' },
        Reason: { type: 'string', description: 'Return reason REF identifier. REQUIRED.' },
        SubtypeReason: { type: 'string', description: 'Return reason subtype REF identifier. REQUIRED.' },
        ReturnAddressRef: {
          type: 'string',
          description: 'Sender address REF from check_possibility response. REQUIRED.',
        },
        Note: { type: 'string', description: 'Additional notes (optional).' },
      },
      required: ['IntDocNumber', 'PaymentMethod', 'Reason', 'SubtypeReason', 'ReturnAddressRef'],
    },
  },
  {
    name: 'return_create_to_new_address',
    description:
      'Create a return order to a new address via AdditionalServiceGeneral/save. Requires settlement, street, and building details. Available for sender clients only.',
    inputSchema: {
      type: 'object',
      properties: {
        IntDocNumber: { type: 'string', description: 'Original document (waybill) number. REQUIRED.' },
        PaymentMethod: { type: 'string', description: 'Payment method: "Cash" or "NonCash". REQUIRED.' },
        Reason: { type: 'string', description: 'Return reason REF identifier. REQUIRED.' },
        SubtypeReason: { type: 'string', description: 'Return reason subtype REF identifier. REQUIRED.' },
        RecipientSettlement: { type: 'string', description: 'Recipient settlement REF. REQUIRED.' },
        RecipientSettlementStreet: { type: 'string', description: 'Recipient street REF. REQUIRED.' },
        BuildingNumber: { type: 'string', description: 'Building number. REQUIRED.' },
        NoteAddressRecipient: { type: 'string', description: 'Address note (apartment, floor, entrance, etc.).' },
        Note: { type: 'string', description: 'Additional notes (optional).' },
      },
      required: [
        'IntDocNumber',
        'PaymentMethod',
        'Reason',
        'SubtypeReason',
        'RecipientSettlement',
        'RecipientSettlementStreet',
        'BuildingNumber',
      ],
    },
  },
  {
    name: 'return_create_to_warehouse',
    description:
      'Create a return order to a warehouse via AdditionalServiceGeneral/save. Uses warehouse REF. Available for sender clients only.',
    inputSchema: {
      type: 'object',
      properties: {
        IntDocNumber: { type: 'string', description: 'Original document (waybill) number. REQUIRED.' },
        PaymentMethod: { type: 'string', description: 'Payment method: "Cash" or "NonCash". REQUIRED.' },
        Reason: { type: 'string', description: 'Return reason REF identifier. REQUIRED.' },
        SubtypeReason: { type: 'string', description: 'Return reason subtype REF identifier. REQUIRED.' },
        RecipientWarehouse: { type: 'string', description: 'Warehouse REF for return. REQUIRED.' },
        Note: { type: 'string', description: 'Additional notes (optional).' },
      },
      required: ['IntDocNumber', 'PaymentMethod', 'Reason', 'SubtypeReason', 'RecipientWarehouse'],
    },
  },
  {
    name: 'return_update',
    description:
      'Update an existing return order via AdditionalServiceGeneral/update. Only works when order status is "Прийняте" (Accepted). Can change delivery address or warehouse.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Return order REF to update. REQUIRED.' },
        IntDocNumber: { type: 'string', description: 'Original document number. REQUIRED.' },
        PaymentMethod: { type: 'string', description: 'Payment method: "Cash" or "NonCash". REQUIRED.' },
        Reason: { type: 'string', description: 'Return reason REF identifier. REQUIRED.' },
        SubtypeReason: { type: 'string', description: 'Return reason subtype REF identifier. REQUIRED.' },
        OnlyGetPricing: { type: 'boolean', description: 'If true, only returns pricing info without updating.' },
        RecipientSettlement: { type: 'string', description: 'New settlement REF (for changing to new address).' },
        RecipientWarehouse: { type: 'string', description: 'New warehouse REF (for changing to warehouse).' },
        RecipientSettlementStreet: { type: 'string', description: 'New street REF (for changing to new address).' },
        BuildingNumber: { type: 'string', description: 'New building number (for changing to new address).' },
        NoteAddressRecipient: { type: 'string', description: 'Address note (apartment, floor, etc.).' },
      },
      required: ['Ref', 'IntDocNumber', 'PaymentMethod', 'Reason', 'SubtypeReason'],
    },
  },
  {
    name: 'return_get_pricing',
    description:
      'Get pricing information for a return order without updating via AdditionalServiceGeneral/update with OnlyGetPricing=true. Returns scheduled delivery date and pricing details.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Return order REF. REQUIRED.' },
        IntDocNumber: { type: 'string', description: 'Original document number. REQUIRED.' },
        PaymentMethod: { type: 'string', description: 'Payment method: "Cash" or "NonCash". REQUIRED.' },
        Reason: { type: 'string', description: 'Return reason REF identifier. REQUIRED.' },
        SubtypeReason: { type: 'string', description: 'Return reason subtype REF identifier. REQUIRED.' },
        RecipientSettlement: { type: 'string', description: 'Settlement REF (if applicable).' },
        RecipientWarehouse: { type: 'string', description: 'Warehouse REF (if applicable).' },
      },
      required: ['Ref', 'IntDocNumber', 'PaymentMethod', 'Reason', 'SubtypeReason'],
    },
  },
];

export function getReturnTools(): Tool[] {
  return returnTools;
}

export async function handleReturnTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'return_get_list':
        return await handleGetList(args, context);
      case 'return_check_possibility':
        return await handleCheckPossibility(args, context);
      case 'return_create_to_sender_address':
        return await handleCreateToSenderAddress(args, context);
      case 'return_create_to_new_address':
        return await handleCreateToNewAddress(args, context);
      case 'return_create_to_warehouse':
        return await handleCreateToWarehouse(args, context);
      case 'return_update':
        return await handleUpdate(args, context);
      case 'return_get_pricing':
        return await handleGetPricing(args, context);
      default:
        throw new Error(`Unknown return tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Return tool "${name}"`);
  }
}

async function handleGetList(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request: GetReturnOrdersListRequest = {};

  if (args?.Number) request.Number = assertString(args.Number, 'Number');
  if (args?.Ref) request.Ref = assertString(args.Ref, 'Ref');
  if (args?.BeginDate) request.BeginDate = assertString(args.BeginDate, 'BeginDate');
  if (args?.EndDate) request.EndDate = assertString(args.EndDate, 'EndDate');
  if (args?.Page) request.Page = assertString(args.Page, 'Page');
  if (args?.Limit) request.Limit = assertString(args.Limit, 'Limit');

  const response = await context.client.return.getList(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      count: response.data?.length ?? 0,
      orders: response.data,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleCheckPossibility(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const Number = assertString(args?.Number, 'Number');

  const request: CheckPossibilityCreateReturnRequest = { Number };
  const response = await context.client.return.checkPossibility(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      canReturn: response.success && response.data?.length > 0,
      addresses: response.data,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleCreateToSenderAddress(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const IntDocNumber = assertString(args?.IntDocNumber, 'IntDocNumber');
  const PaymentMethod = assertString(args?.PaymentMethod, 'PaymentMethod');
  const Reason = assertString(args?.Reason, 'Reason');
  const SubtypeReason = assertString(args?.SubtypeReason, 'SubtypeReason');
  const ReturnAddressRef = assertString(args?.ReturnAddressRef, 'ReturnAddressRef');
  const Note = assertOptionalString(args?.Note, 'Note');

  const response = await context.client.return.createToSenderAddress({
    IntDocNumber,
    PaymentMethod: PaymentMethod as 'Cash' | 'NonCash',
    Reason,
    SubtypeReason,
    ReturnAddressRef,
    ...(Note ? { Note } : {}),
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      orderNumber: response.data?.[0]?.Number,
      orderRef: response.data?.[0]?.Ref,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleCreateToNewAddress(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const IntDocNumber = assertString(args?.IntDocNumber, 'IntDocNumber');
  const PaymentMethod = assertString(args?.PaymentMethod, 'PaymentMethod');
  const Reason = assertString(args?.Reason, 'Reason');
  const SubtypeReason = assertString(args?.SubtypeReason, 'SubtypeReason');
  const RecipientSettlement = assertString(args?.RecipientSettlement, 'RecipientSettlement');
  const RecipientSettlementStreet = assertString(args?.RecipientSettlementStreet, 'RecipientSettlementStreet');
  const BuildingNumber = assertString(args?.BuildingNumber, 'BuildingNumber');
  const NoteAddressRecipient = assertOptionalString(args?.NoteAddressRecipient, 'NoteAddressRecipient');
  const Note = assertOptionalString(args?.Note, 'Note');

  const response = await context.client.return.createToNewAddress({
    IntDocNumber,
    PaymentMethod: PaymentMethod as 'Cash' | 'NonCash',
    Reason,
    SubtypeReason,
    RecipientSettlement,
    RecipientSettlementStreet,
    BuildingNumber,
    ...(NoteAddressRecipient ? { NoteAddressRecipient } : {}),
    ...(Note ? { Note } : {}),
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      orderNumber: response.data?.[0]?.Number,
      orderRef: response.data?.[0]?.Ref,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleCreateToWarehouse(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const IntDocNumber = assertString(args?.IntDocNumber, 'IntDocNumber');
  const PaymentMethod = assertString(args?.PaymentMethod, 'PaymentMethod');
  const Reason = assertString(args?.Reason, 'Reason');
  const SubtypeReason = assertString(args?.SubtypeReason, 'SubtypeReason');
  const RecipientWarehouse = assertString(args?.RecipientWarehouse, 'RecipientWarehouse');
  const Note = assertOptionalString(args?.Note, 'Note');

  const response = await context.client.return.createToWarehouse({
    IntDocNumber,
    PaymentMethod: PaymentMethod as 'Cash' | 'NonCash',
    Reason,
    SubtypeReason,
    RecipientWarehouse,
    ...(Note ? { Note } : {}),
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      orderNumber: response.data?.[0]?.Number,
      orderRef: response.data?.[0]?.Ref,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleUpdate(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const Ref = assertString(args?.Ref, 'Ref');
  const IntDocNumber = assertString(args?.IntDocNumber, 'IntDocNumber');
  const PaymentMethod = assertString(args?.PaymentMethod, 'PaymentMethod');
  const Reason = assertString(args?.Reason, 'Reason');
  const SubtypeReason = assertString(args?.SubtypeReason, 'SubtypeReason');

  const request: UpdateReturnRequest = {
    Ref,
    IntDocNumber,
    PaymentMethod: PaymentMethod as 'Cash' | 'NonCash',
    OrderType: 'orderCargoReturn',
    Reason,
    SubtypeReason,
  };

  // Optional fields
  if (args?.OnlyGetPricing !== undefined) {
    request.OnlyGetPricing = assertOptionalBoolean(args.OnlyGetPricing, 'OnlyGetPricing');
  }
  if (args?.RecipientSettlement) {
    request.RecipientSettlement = assertString(args.RecipientSettlement, 'RecipientSettlement');
  }
  if (args?.RecipientWarehouse) {
    request.RecipientWarehouse = assertString(args.RecipientWarehouse, 'RecipientWarehouse');
  }
  if (args?.RecipientSettlementStreet) {
    request.RecipientSettlementStreet = assertString(args.RecipientSettlementStreet, 'RecipientSettlementStreet');
  }
  if (args?.BuildingNumber) {
    request.BuildingNumber = assertString(args.BuildingNumber, 'BuildingNumber');
  }
  if (args?.NoteAddressRecipient) {
    request.NoteAddressRecipient = assertString(args.NoteAddressRecipient, 'NoteAddressRecipient');
  }

  const response = await context.client.return.update(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      scheduledDeliveryDate: response.data?.[0]?.ScheduledDeliveryDate,
      pricing: response.data?.[0]?.Pricing,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleGetPricing(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const Ref = assertString(args?.Ref, 'Ref');
  const IntDocNumber = assertString(args?.IntDocNumber, 'IntDocNumber');
  const PaymentMethod = assertString(args?.PaymentMethod, 'PaymentMethod');
  const Reason = assertString(args?.Reason, 'Reason');
  const SubtypeReason = assertString(args?.SubtypeReason, 'SubtypeReason');

  const request: Omit<UpdateReturnRequest, 'OnlyGetPricing'> = {
    Ref,
    IntDocNumber,
    PaymentMethod: PaymentMethod as 'Cash' | 'NonCash',
    OrderType: 'orderCargoReturn',
    Reason,
    SubtypeReason,
  };

  // Optional fields
  if (args?.RecipientSettlement) {
    request.RecipientSettlement = assertString(args.RecipientSettlement, 'RecipientSettlement');
  }
  if (args?.RecipientWarehouse) {
    request.RecipientWarehouse = assertString(args.RecipientWarehouse, 'RecipientWarehouse');
  }

  const response = await context.client.return.getPricing(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      scheduledDeliveryDate: response.data?.[0]?.ScheduledDeliveryDate,
      pricing: response.data?.[0]?.Pricing,
      errors: response.errors,
    }),
    { response },
  );
}
