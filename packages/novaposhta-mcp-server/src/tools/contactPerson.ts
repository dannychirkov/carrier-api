import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult, formatResponseErrors } from '../utils/error-handler.js';
import { assertOptionalString, assertString } from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';

const contactPersonTools: Tool[] = [
  {
    name: 'contact_person_save',
    description:
      'Create new contact person for a counterparty via ContactPerson/save (doc 1.26). Docs require entering all fields in Ukrainian and with an API key; response returns the Ref/Description pair referenced in waybills.',
    inputSchema: {
      type: 'object',
      properties: {
        CounterpartyRef: { type: 'string', description: 'Counterparty reference from getCounterparties.' },
        FirstName: { type: 'string', description: 'First name (required).' },
        MiddleName: { type: 'string', description: 'Middle name (optional).' },
        LastName: { type: 'string', description: 'Last name (required).' },
        Phone: { type: 'string', description: 'Phone number 380XXXXXXXXX (required).' },
        Email: { type: 'string', description: 'Email address (optional).' }
      },
      required: ['CounterpartyRef', 'FirstName', 'LastName', 'Phone']
    }
  },
  {
    name: 'contact_person_update',
    description:
      'Update existing contact person details via ContactPerson/update (doc 1.27). Only legal entities may edit full profiles, private persons can change phone only, and edits are allowed solely before a waybill is issued for that counterparty.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Contact person reference to update.' },
        CounterpartyRef: { type: 'string', description: 'Counterparty reference.' },
        FirstName: { type: 'string', description: 'Updated first name.' },
        MiddleName: { type: 'string', description: 'Updated middle name.' },
        LastName: { type: 'string', description: 'Updated last name.' },
        Phone: { type: 'string', description: 'Updated phone.' },
        Email: { type: 'string', description: 'Updated email.' }
      },
      required: ['Ref', 'CounterpartyRef']
    }
  },
  {
    name: 'contact_person_delete',
    description:
      'Delete contact person by reference using ContactPerson/delete (doc 1.27). Nova Poshta allows deletions via API only for legal entities and only until the contact was used on an Internet document.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Contact person reference to delete.' },
        CounterpartyRef: { type: 'string', description: 'Counterparty reference.' }
      },
      required: ['Ref', 'CounterpartyRef']
    }
  },
];

export function getContactPersonTools(): Tool[] {
  return contactPersonTools;
}

export async function handleContactPersonTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'contact_person_save':
        return await handleSaveContactPerson(args, context);
      case 'contact_person_update':
        return await handleUpdateContactPerson(args, context);
      case 'contact_person_delete':
        return await handleDeleteContactPerson(args, context);
      default:
        throw new Error(`Unknown contact person tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Contact person tool "${name}"`);
  }
}

async function handleSaveContactPerson(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const counterpartyRef = assertString(args?.CounterpartyRef, 'CounterpartyRef');
  const firstName = assertString(args?.FirstName, 'FirstName');
  const lastName = assertString(args?.LastName, 'LastName');
  const phone = assertString(args?.Phone, 'Phone');
  const middleName = assertOptionalString(args?.MiddleName, 'MiddleName');
  const email = assertOptionalString(args?.Email, 'Email');

  const response = await context.client.contactPerson.save({
    CounterpartyRef: counterpartyRef,
    FirstName: firstName,
    LastName: lastName,
    Phone: phone,
    ...(middleName ? { MiddleName: middleName } : {}),
    ...(email ? { Email: email } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to save contact person'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      ref: response.data?.[0]?.Ref,
      description: response.data?.[0]?.Description,
    })
  );
}

async function handleUpdateContactPerson(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const counterpartyRef = assertString(args?.CounterpartyRef, 'CounterpartyRef');
  const firstName = assertOptionalString(args?.FirstName, 'FirstName');
  const middleName = assertOptionalString(args?.MiddleName, 'MiddleName');
  const lastName = assertOptionalString(args?.LastName, 'LastName');
  const phone = assertOptionalString(args?.Phone, 'Phone');
  const email = assertOptionalString(args?.Email, 'Email');

  const response = await context.client.contactPerson.update({
    Ref: ref,
    CounterpartyRef: counterpartyRef,
    ...(firstName !== undefined ? { FirstName: firstName } : {}),
    ...(middleName !== undefined ? { MiddleName: middleName } : {}),
    ...(lastName !== undefined ? { LastName: lastName } : {}),
    ...(phone !== undefined ? { Phone: phone } : {}),
    ...(email !== undefined ? { Email: email } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to update contact person'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      ref: response.data?.[0]?.Ref,
      description: response.data?.[0]?.Description,
    })
  );
}

async function handleDeleteContactPerson(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const counterpartyRef = assertString(args?.CounterpartyRef, 'CounterpartyRef');

  const response = await context.client.contactPerson.delete({
    Ref: ref,
    CounterpartyRef: counterpartyRef,
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to delete contact person'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      message: 'Contact person deleted successfully',
    })
  );
}
