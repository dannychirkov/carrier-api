import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult } from '../utils/error-handler.js';
import {
  assertOptionalString,
  assertString,
  isPhoneNumber,
  isTrackingNumber,
  sanitizePhone,
  isDateFormat,
} from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';

const trackingTools: Tool[] = [
  {
    name: 'track_document',
    description:
      'Track a single Nova Poshta document by number and optional phone to receive live status, location, and ETA. Doc 1.2 describes the standard success/data/errors/warnings/info envelope returned by Nova Poshta, which this helper surfaces back to the caller.',
    inputSchema: {
      type: 'object',
      properties: {
        DocumentNumber: {
          type: 'string',
          description: 'Nova Poshta tracking number (14 digits).',
        },
        Phone: {
          type: 'string',
          description: 'Optional recipient phone in international format (380XXXXXXXXX).',
        },
      },
      required: ['DocumentNumber'],
    },
  },
  {
    name: 'track_multiple_documents',
    description:
      'Track multiple Nova Poshta documents at once and receive aggregated statistics. Doc 1.2 states every API call returns the same envelope, so use the success/errors/warnings fields here to mirror the native batch tracking response.',
    inputSchema: {
      type: 'object',
      properties: {
        DocumentNumbers: {
          type: 'array',
          description: 'List of tracking numbers to check.',
          items: {
            type: 'string',
          },
        },
      },
      required: ['DocumentNumbers'],
    },
  },
  {
    name: 'track_multiple',
    description:
      'Track multiple Nova Poshta documents with organized results and statistics via TrackingDocument/getStatusDocuments (doc 1.2). Returns successful/failed tracking attempts with delivery statistics (delivered, in-transit, at-warehouse counts). More convenient than track_multiple_documents for batch operations.',
    inputSchema: {
      type: 'object',
      properties: {
        DocumentNumbers: {
          type: 'array',
          description: 'List of tracking numbers (14 digits each).',
          items: {
            type: 'string',
          },
        },
      },
      required: ['DocumentNumbers'],
    },
  },
  {
    name: 'get_document_movement',
    description:
      'Get movement history for up to 10 documents including statuses and timestamps. Doc 1.2 identifies InternetDocument numbers as the primary shipment identifiers, which this endpoint accepts in batches.',
    inputSchema: {
      type: 'object',
      properties: {
        DocumentNumbers: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        ShowDeliveryDetails: {
          type: 'boolean',
          description: 'Include extended delivery checkpoints.',
        },
      },
      required: ['DocumentNumbers'],
    },
  },
  {
    name: 'get_document_list',
    description:
      'List documents created in the given date range. Per doc 1.2, these queries target the InternetDocument model used for оформлення відправлень, so date filters help keep the success/data/errors response manageable.',
    inputSchema: {
      type: 'object',
      properties: {
        DateTimeFrom: {
          type: 'string',
          description: 'Start date (format dd.mm.yyyy).',
        },
        DateTimeTo: {
          type: 'string',
          description: 'End date (format dd.mm.yyyy).',
        },
        Page: {
          type: 'number',
          description: 'Page number (default 1).',
        },
        GetFullList: {
          type: 'string',
          description: 'Use "1" to request full list ignoring pagination (may be slow).',
        },
      },
      required: ['DateTimeFrom', 'DateTimeTo'],
    },
  },
];

export function getTrackingTools(): Tool[] {
  return trackingTools;
}

export async function handleTrackingTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'track_document':
        return await handleTrackDocument(args, context);
      case 'track_multiple_documents':
        return await handleTrackMultipleDocuments(args, context);
      case 'track_multiple':
        return await handleTrackMultiple(args, context);
      case 'get_document_movement':
        return await handleDocumentMovement(args, context);
      case 'get_document_list':
        return await handleDocumentList(args, context);
      default:
        throw new Error(`Unknown tracking tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Tracking tool "${name}"`);
  }
}

async function handleTrackDocument(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const documentNumber = assertString(args?.DocumentNumber, 'DocumentNumber').trim();
  if (!isTrackingNumber(documentNumber)) {
    throw new Error('DocumentNumber must be a 14-digit Nova Poshta tracking number');
  }

  let phone = assertOptionalString(args?.Phone, 'Phone');
  if (phone) {
    phone = sanitizePhone(phone);
    if (!isPhoneNumber(phone)) {
      throw new Error('Phone must match format 380XXXXXXXXX or +380XXXXXXXXX');
    }
  }

  const result = await context.client.tracking.trackDocument(documentNumber, phone);
  if (!result) {
    return createTextResult(`Document ${documentNumber} not found`, { documentNumber });
  }

  const highlighted = {
    number: result.Number,
    status: result.Status,
    statusCode: result.StatusCode,
    city: result.CityRecipient,
    warehouse: result.WarehouseRecipient,
    scheduledDeliveryDate: result.ScheduledDeliveryDate,
    actualDeliveryDate: result.ActualDeliveryDate,
    recipientDateTime: result.RecipientDateTime,
    weight: result.DocumentWeight,
    cost: result.DocumentCost,
  };

  return createTextResult(formatAsJson(highlighted), { document: result });
}

async function handleTrackMultipleDocuments(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const rawNumbers = Array.isArray(args?.DocumentNumbers) ? (args?.DocumentNumbers as unknown[]) : [];
  const numbers = rawNumbers.map(value => assertString(value, 'DocumentNumbers[]'));
  if (numbers.length === 0) {
    throw new Error('DocumentNumbers must contain at least one tracking number');
  }

  numbers.forEach(num => {
    if (!isTrackingNumber(num)) {
      throw new Error(`Invalid tracking number: ${num}`);
    }
  });

  const response = await context.client.tracking.trackDocuments({
    Documents: numbers.map(documentNumber => ({ DocumentNumber: documentNumber })),
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      errors: response.errors,
      tracked: response.data?.length ?? 0,
    }),
    { response },
  );
}

async function handleTrackMultiple(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const rawNumbers = Array.isArray(args?.DocumentNumbers) ? (args?.DocumentNumbers as unknown[]) : [];
  const numbers = rawNumbers.map(value => assertString(value, 'DocumentNumbers[]'));
  if (numbers.length === 0) {
    throw new Error('DocumentNumbers must contain at least one tracking number');
  }

  numbers.forEach(num => {
    if (!isTrackingNumber(num)) {
      throw new Error(`Invalid tracking number: ${num}`);
    }
  });

  const result = await context.client.tracking.trackMultiple(numbers);

  return createTextResult(
    formatAsJson({
      successful: result.successful.length,
      failed: result.failed.length,
      statistics: result.statistics,
    }),
    { result },
  );
}

async function handleDocumentMovement(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const rawNumbers = Array.isArray(args?.DocumentNumbers) ? (args?.DocumentNumbers as unknown[]) : [];
  const numbers = rawNumbers.map(value => assertString(value, 'DocumentNumbers[]'));
  if (numbers.length === 0) {
    throw new Error('DocumentNumbers must contain at least one tracking number');
  }

  const showDeliveryDetails = Boolean(args?.ShowDeliveryDetails);
  const response = await context.client.tracking.getDocumentMovement({
    Documents: numbers.map(documentNumber => ({ DocumentNumber: documentNumber })),
    ShowDeliveryDetails: showDeliveryDetails,
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      entries: response.data?.length ?? 0,
    }),
    { response },
  );
}

async function handleDocumentList(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const dateTimeFrom = assertString(args?.DateTimeFrom, 'DateTimeFrom').trim();
  const dateTimeTo = assertString(args?.DateTimeTo, 'DateTimeTo').trim();

  if (!isDateFormat(dateTimeFrom)) {
    throw new Error('DateTimeFrom must be in format dd.mm.yyyy');
  }
  if (!isDateFormat(dateTimeTo)) {
    throw new Error('DateTimeTo must be in format dd.mm.yyyy');
  }

  const page = args?.Page !== undefined ? Number(args.Page) : undefined;
  const getFullListInput = args?.GetFullList;
  const getFullList =
    getFullListInput === '1' || getFullListInput === 1 || getFullListInput === true ? '1' : '0';

  const response = await context.client.tracking.getDocumentList({
    DateTimeFrom: dateTimeFrom,
    DateTimeTo: dateTimeTo,
    ...(page !== undefined ? { Page: page } : {}),
    GetFullList: getFullList,
  });

  return createTextResult(
    formatAsJson({
      success: response.success,
      documents: response.data?.length ?? 0,
    }),
    { response },
  );
}
