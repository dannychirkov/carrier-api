import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import type {
  CreateWaybillRequest,
  CreateWaybillWithOptionsRequest,
  CreatePoshtomatWaybillRequest,
  DeleteWaybillRequest,
  DeliveryDateRequest,
  PriceCalculationRequest,
  UpdateWaybillRequest,
} from '@shopana/novaposhta-api-client';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult } from '../utils/error-handler.js';
import { assertOptionalString, assertString } from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';

const waybillTools: Tool[] = [
  {
    name: 'waybill_calculate_cost',
    description:
      'Calculate delivery cost and optional delivery date estimation for a shipment. Doc 1.2 explains that every Nova Poshta call sends apiKey/modelName/calledMethod/methodProperties, so this helper either forwards your raw InternetDocument payload or builds one from typed fields.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta price calculation payload (citySender, cityRecipient, serviceType, cost, weight, cargoType, seatsAmount).',
        },
        citySender: { type: 'string', description: 'Sender city reference.' },
        cityRecipient: { type: 'string', description: 'Recipient city reference.' },
        serviceType: { type: 'string', description: 'Service type (WarehouseWarehouse, WarehouseDoors, etc.).' },
        cargoType: { type: 'string', description: 'Cargo type (Parcel, Documents, TiresWheels, etc.).' },
        cost: { type: 'number', description: 'Declared value in UAH.' },
        weight: { type: 'number', description: 'Weight in kg.' },
        seatsAmount: { type: 'number', description: 'Number of seats.' },
      },
      required: [],
    },
  },
  {
    name: 'waybill_get_estimate',
    description:
      'Get complete shipment estimate (price + delivery date) in one call via InternetDocument/getDocumentPrice and getDocumentDeliveryDate (doc 1.2). Combines cost calculation and delivery date estimation for convenience. Requires same parameters as waybill_calculate_cost.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta price calculation payload.',
        },
        citySender: { type: 'string', description: 'Sender city reference.' },
        cityRecipient: { type: 'string', description: 'Recipient city reference.' },
        serviceType: { type: 'string', description: 'Service type (WarehouseWarehouse, WarehouseDoors, etc.).' },
        cargoType: { type: 'string', description: 'Cargo type (Parcel, Documents, TiresWheels, etc.).' },
        cost: { type: 'number', description: 'Declared value in UAH.' },
        weight: { type: 'number', description: 'Weight in kg.' },
        seatsAmount: { type: 'number', description: 'Number of seats.' },
      },
      required: [],
    },
  },
  {
    name: 'waybill_create',
    description:
      'Create a standard Nova Poshta waybill (Internet document) via InternetDocument/save (doc 1.2). This is the basic waybill creation method. For additional services use waybill_create_with_options. For postomat delivery use waybill_create_for_postomat.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta create waybill payload (see docs).',
        },
      },
      required: ['request'],
    },
  },
  {
    name: 'waybill_create_with_options',
    description:
      'Create a Nova Poshta waybill with additional options and services via InternetDocument/save (doc 1.2). Supports backward delivery, additional services, third-party payer, and RedBox barcodes. Use this when you need COD, insurance, or return shipments.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta create waybill payload with additional options (backwardDeliveryData, additionalServices, thirdPerson, redBoxBarcode).',
        },
      },
      required: ['request'],
    },
  },
  {
    name: 'waybill_create_for_postomat',
    description:
      'Create a waybill for postomat delivery via InternetDocument/save (doc 1.2). Postomats have size/weight restrictions (max 30kg, max dimensions). Requires proper warehouse selection (postomat type) and seat options configuration.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta create postomat waybill payload with optionsSeat array.',
        },
      },
      required: ['request'],
    },
  },
  {
    name: 'waybill_create_batch',
    description:
      'Batch create multiple waybills sequentially via InternetDocument/save (doc 1.2). Processes each waybill one by one to avoid rate limiting. Returns array of results including any errors. Useful for bulk shipment creation.',
    inputSchema: {
      type: 'object',
      properties: {
        requests: {
          type: 'array',
          items: { type: 'object' },
          description: 'Array of Nova Poshta create waybill payloads.',
        },
      },
      required: ['requests'],
    },
  },
  {
    name: 'waybill_update',
    description:
      'Update an existing waybill. Per doc 1.2 the same InternetDocument request envelope is used for update calls, so pass the raw payload (must include DocumentRef) exactly as defined by Nova Poshta.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta update payload (must include DocumentRef).',
        },
      },
      required: ['request'],
    },
  },
  {
    name: 'waybill_delete',
    description:
      'Delete one or multiple waybills by their DocumentRef via InternetDocument/delete (doc 1.2). Waybills can only be deleted before they enter processing. Returns success/error status for the operation.',
    inputSchema: {
      type: 'object',
      properties: {
        documentRefs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of DocumentRef values to delete.',
        },
      },
      required: ['documentRefs'],
    },
  },
  {
    name: 'waybill_delete_batch',
    description:
      'Batch delete multiple waybills by their DocumentRef via InternetDocument/delete (doc 1.2). Alias for waybill_delete that processes all refs in a single API call. Waybills can only be deleted before they enter processing.',
    inputSchema: {
      type: 'object',
      properties: {
        documentRefs: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of DocumentRef values to delete.',
        },
      },
      required: ['documentRefs'],
    },
  },
  {
    name: 'waybill_get_delivery_date',
    description:
      'Get estimated delivery date for a city pair and service type. Doc 1.2 outlines the generic Nova Poshta envelope, and this helper builds the methodProperties (citySender, cityRecipient, serviceType, optional dateTime) expected by the delivery-date method.',
    inputSchema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          description: 'Raw Nova Poshta delivery date payload.',
        },
        citySender: { type: 'string', description: 'Sender city reference.' },
        cityRecipient: { type: 'string', description: 'Recipient city reference.' },
        serviceType: { type: 'string', description: 'Service type.' },
        dateTime: { type: 'string', description: 'Optional shipment date (dd.mm.yyyy).' },
      },
      required: [],
    },
  },
];

export function getWaybillTools(): Tool[] {
  return waybillTools;
}

export async function handleWaybillTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'waybill_calculate_cost':
        return await handleCalculateCost(args, context);
      case 'waybill_get_estimate':
        return await handleGetEstimate(args, context);
      case 'waybill_create':
        return await handleCreateWaybill(args, context);
      case 'waybill_create_with_options':
        return await handleCreateWaybillWithOptions(args, context);
      case 'waybill_create_for_postomat':
        return await handleCreateForPostomat(args, context);
      case 'waybill_create_batch':
        return await handleCreateBatch(args, context);
      case 'waybill_update':
        return await handleUpdateWaybill(args, context);
      case 'waybill_delete':
        return await handleDeleteWaybill(args, context);
      case 'waybill_delete_batch':
        return await handleDeleteBatch(args, context);
      case 'waybill_get_delivery_date':
        return await handleDeliveryDate(args, context);
      default:
        throw new Error(`Unknown waybill tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Waybill tool "${name}"`);
  }
}

async function handleCalculateCost(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = buildPriceRequest(args);
  const [price, delivery] = await Promise.all([
    context.client.waybill.getPrice(request),
    context.client.waybill.getDeliveryDate({
      citySender: request.citySender,
      cityRecipient: request.cityRecipient,
      serviceType: request.serviceType,
    }),
  ]);

  const structured = {
    success: price.success && delivery.success,
    price: price.data?.[0],
    deliveryDate: delivery.data?.[0],
  };

  return createTextResult(formatAsJson(structured), { price, delivery });
}

async function handleCreateWaybill(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = ensureObject<CreateWaybillRequest>(args?.request, 'request');
  const response = await context.client.waybill.create(request);
  return createTextResult(
    formatAsJson({
      success: response.success,
      refs: response.data?.map(item => item.Ref),
      warnings: response.warnings,
    }),
    { response },
  );
}

async function handleUpdateWaybill(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = ensureObject<UpdateWaybillRequest>(args?.request, 'request');
  const response = await context.client.waybill.update(request);
  return createTextResult(
    formatAsJson({
      success: response.success,
      updated: response.data?.length ?? 0,
      warnings: response.warnings,
    }),
    { response },
  );
}

async function handleDeleteWaybill(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const documentRefsInput = Array.isArray(args?.documentRefs) ? (args?.documentRefs as unknown[]) : [];
  const documentRefs = documentRefsInput.map(value => assertString(value, 'documentRefs[]'));
  if (documentRefs.length === 0) {
    throw new Error('documentRefs must contain at least one DocumentRef');
  }

  const request: DeleteWaybillRequest = { documentRefs };
  const response = await context.client.waybill.delete(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      deleted: response.data?.length ?? 0,
      errors: response.errors,
    }),
    { response },
  );
}

async function handleDeliveryDate(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = buildDeliveryDateRequest(args);
  const response = await context.client.waybill.getDeliveryDate(request);

  return createTextResult(
    formatAsJson({
      success: response.success,
      deliveryDate: response.data?.[0],
      warnings: response.warnings,
    }),
    { response },
  );
}

function buildPriceRequest(args: ToolArguments): PriceCalculationRequest {
  if (args?.request && typeof args.request === 'object') {
    const req = args.request as Record<string, unknown>;

    // Validate required fields
    const citySender = assertString(req.citySender, 'request.citySender');
    const cityRecipient = assertString(req.cityRecipient, 'request.cityRecipient');
    const serviceType = assertString(req.serviceType, 'request.serviceType');
    const cargoType = assertString(req.cargoType, 'request.cargoType');
    const cost = Number(req.cost);
    const weight = Number(req.weight);
    const seatsAmount = Number(req.seatsAmount ?? 1);

    if ([cost, weight, seatsAmount].some(value => Number.isNaN(value))) {
      throw new Error('request.cost, request.weight, and request.seatsAmount must be valid numbers');
    }

    return {
      ...req,
      citySender,
      cityRecipient,
      serviceType,
      cargoType,
      cost,
      weight,
      seatsAmount,
    } as PriceCalculationRequest;
  }

  const citySender = assertString(args?.citySender, 'citySender');
  const cityRecipient = assertString(args?.cityRecipient, 'cityRecipient');
  const serviceType = assertString(args?.serviceType, 'serviceType');
  const cargoType = assertString(args?.cargoType, 'cargoType');
  const cost = Number(args?.cost);
  const weight = Number(args?.weight);
  const seatsAmount = Number(args?.seatsAmount ?? 1);

  if ([cost, weight, seatsAmount].some(value => Number.isNaN(value))) {
    throw new Error('cost, weight, and seatsAmount must be valid numbers');
  }

  return {
    citySender,
    cityRecipient,
    serviceType: serviceType as PriceCalculationRequest['serviceType'],
    cargoType: cargoType as PriceCalculationRequest['cargoType'],
    cost,
    weight,
    seatsAmount,
  };
}

function buildDeliveryDateRequest(args: ToolArguments): DeliveryDateRequest {
  if (args?.request && typeof args.request === 'object') {
    const req = args.request as Record<string, unknown>;

    // Validate required fields
    const citySender = assertString(req.citySender, 'request.citySender');
    const cityRecipient = assertString(req.cityRecipient, 'request.cityRecipient');
    const serviceType = assertString(req.serviceType, 'request.serviceType');
    const dateTime = assertOptionalString(req.dateTime, 'request.dateTime');

    return {
      ...req,
      citySender,
      cityRecipient,
      serviceType,
      ...(dateTime ? { dateTime } : {}),
    } as DeliveryDateRequest;
  }

  const citySender = assertString(args?.citySender, 'citySender');
  const cityRecipient = assertString(args?.cityRecipient, 'cityRecipient');
  const serviceType = assertString(args?.serviceType, 'serviceType');
  const dateTime = assertOptionalString(args?.dateTime, 'dateTime');

  const request: DeliveryDateRequest = {
    citySender,
    cityRecipient,
    serviceType: serviceType as DeliveryDateRequest['serviceType'],
    ...(dateTime ? { dateTime: dateTime as DeliveryDateRequest['dateTime'] } : {}),
  };

  return request;
}

function ensureObject<T>(value: unknown, field: string): T {
  if (!value || typeof value !== 'object') {
    throw new Error(`${field} must be an object with valid Nova Poshta payload`);
  }
  return value as T;
}

async function handleGetEstimate(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = buildPriceRequest(args);
  const result = await context.client.waybill.getEstimate(request);

  return createTextResult(
    formatAsJson({
      price: result.price.data?.[0],
      deliveryDate: result.deliveryDate.data?.[0],
      success: result.price.success && result.deliveryDate.success,
    }),
    { price: result.price, deliveryDate: result.deliveryDate },
  );
}

async function handleCreateWaybillWithOptions(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = ensureObject<CreateWaybillWithOptionsRequest>(args?.request, 'request');
  const response = await context.client.waybill.createWithOptions(request);
  return createTextResult(
    formatAsJson({
      success: response.success,
      refs: response.data?.map(item => item.Ref),
      warnings: response.warnings,
    }),
    { response },
  );
}

async function handleCreateForPostomat(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const request = ensureObject<CreatePoshtomatWaybillRequest>(args?.request, 'request');
  const response = await context.client.waybill.createForPostomat(request);
  return createTextResult(
    formatAsJson({
      success: response.success,
      refs: response.data?.map(item => item.Ref),
      warnings: response.warnings,
    }),
    { response },
  );
}

async function handleCreateBatch(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const requestsInput = Array.isArray(args?.requests) ? (args?.requests as unknown[]) : [];
  if (requestsInput.length === 0) {
    throw new Error('requests must contain at least one waybill request');
  }

  const requests = requestsInput.map((req, idx) => ensureObject<CreateWaybillRequest>(req, `requests[${idx}]`));
  const responses = await context.client.waybill.createBatch(requests);

  const summary = {
    total: responses.length,
    successful: responses.filter(r => r.success).length,
    failed: responses.filter(r => !r.success).length,
  };

  return createTextResult(formatAsJson({ summary, results: responses }));
}

async function handleDeleteBatch(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const documentRefsInput = Array.isArray(args?.documentRefs) ? (args?.documentRefs as unknown[]) : [];
  const documentRefs = documentRefsInput.map(value => assertString(value, 'documentRefs[]'));
  if (documentRefs.length === 0) {
    throw new Error('documentRefs must contain at least one DocumentRef');
  }

  const response = await context.client.waybill.deleteBatch(documentRefs);

  return createTextResult(
    formatAsJson({
      success: response.success,
      deleted: response.data?.length ?? 0,
      errors: response.errors,
    }),
    { response },
  );
}
