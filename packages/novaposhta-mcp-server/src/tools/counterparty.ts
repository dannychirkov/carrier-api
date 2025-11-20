import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult, formatResponseErrors } from '../utils/error-handler.js';
import { assertOptionalNumber, assertOptionalString, assertString } from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';

const counterpartyTools: Tool[] = [
  {
    name: 'counterparty_get_counterparties',
    description:
      'Get counterparties list filtered by property (Sender/Recipient/ThirdPerson) via Counterparty/getCounterparties (doc 1.6). Docs require an API key, recommend caching the directory daily, and note each page tops out at 500 rows so always filter with CounterpartyProperty/FindByString.',
    inputSchema: {
      type: 'object',
      properties: {
        CounterpartyProperty: {
          type: 'string',
          description: 'Counterparty role: Sender, Recipient, or ThirdPerson.',
          enum: ['Sender', 'Recipient', 'ThirdPerson']
        },
        Page: { type: 'number', description: 'Page number (default 1).' },
        FindByString: { type: 'string', description: 'Search by name, phone, or EDRPOU.' },
        CityRef: { type: 'string', description: 'Filter by city reference.' }
      },
      required: ['CounterpartyProperty']
    }
  },
  {
    name: 'counterparty_get_addresses',
    description:
      'Get addresses for a specific counterparty using Counterparty/getCounterpartyAddresses (doc 1.6). Requires API key plus CounterpartyProperty/Ref and, per docs, should be refreshed daily because every page is capped at 500 entries.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Counterparty reference from getCounterparties.' },
        CounterpartyProperty: {
          type: 'string',
          description: 'Counterparty role: Sender or Recipient.',
          enum: ['Sender', 'Recipient']
        },
        Page: { type: 'number', description: 'Page number (default 1).' }
      },
      required: ['Ref']
    }
  },
  {
    name: 'counterparty_get_contact_persons',
    description:
      'Get contact persons for a counterparty through Counterparty/getCounterpartyContactPersons (doc 1.6). API key is mandatory and the list should be cached daily; use paging to stay under the 500-record response cap.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Counterparty reference.' },
        Page: { type: 'number', description: 'Page number (default 1).' }
      },
      required: ['Ref']
    }
  },
  {
    name: 'counterparty_save',
    description:
      'Create new counterparty (private person or organization) with Counterparty/save (docs 1.20–1.21). Provide CityRef + CounterpartyProperty/Type; private persons require first/last name while organizations must also send OwnershipForm and EDRPOU. Docs recommend refreshing supporting directories monthly and note an API key is required.',
    inputSchema: {
      type: 'object',
      properties: {
        CounterpartyType: {
          type: 'string',
          description: 'Type: PrivatePerson or Organization',
          enum: ['PrivatePerson', 'Organization']
        },
        CounterpartyProperty: {
          type: 'string',
          description: 'Role: Sender or Recipient',
          enum: ['Sender', 'Recipient']
        },
        FirstName: { type: 'string', description: 'First name (required for PrivatePerson, optional for Organization).' },
        MiddleName: { type: 'string', description: 'Middle name (optional).' },
        LastName: { type: 'string', description: 'Last name (required for PrivatePerson, optional for Organization).' },
        Phone: { type: 'string', description: 'Phone number in format 380XXXXXXXXX (required).' },
        Email: { type: 'string', description: 'Email address (optional).' },
        OwnershipForm: { type: 'string', description: 'Ownership form reference (required for Organization).' },
        EDRPOU: { type: 'string', description: 'EDRPOU code (required for Organization).' }
      },
      required: ['CounterpartyType', 'CounterpartyProperty', 'Phone']
    }
  },
  {
    name: 'counterparty_update',
    description:
      'Update existing counterparty details via Counterparty/update (doc 1.22). Nova Poshta only lets you edit a counterparty from creation up until you create a waybill (ІД) with it, so run updates early.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Counterparty reference to update.' },
        CounterpartyProperty: {
          type: 'string',
          description: 'Counterparty role: Sender or Recipient',
          enum: ['Sender', 'Recipient']
        },
        FirstName: { type: 'string', description: 'Updated first name.' },
        MiddleName: { type: 'string', description: 'Updated middle name.' },
        LastName: { type: 'string', description: 'Updated last name.' },
        Phone: { type: 'string', description: 'Updated phone.' },
        Email: { type: 'string', description: 'Updated email.' }
      },
      required: ['Ref', 'CounterpartyProperty']
    }
  },
  {
    name: 'counterparty_delete',
    description:
      'Delete counterparty by reference using Counterparty/delete (doc 1.22). IMPORTANT: Docs explicitly state only Recipient counterparties can be deleted through the API; Sender cleanup must go through your account manager.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Counterparty reference to delete.' }
      },
      required: ['Ref']
    }
  },
  {
    name: 'counterparty_get_options',
    description:
      'Get counterparty options and permissions via Counterparty/getCounterpartyOptions (doc 1.23) to see booleans such as CanPayTheThirdPerson, CanSameDayDelivery, HideDeliveryCost, etc., before building a waybill.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Counterparty reference.' }
      },
      required: ['Ref']
    }
  },
];

export function getCounterpartyTools(): Tool[] {
  return counterpartyTools;
}

export async function handleCounterpartyTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'counterparty_get_counterparties':
        return await handleGetCounterparties(args, context);
      case 'counterparty_get_addresses':
        return await handleGetCounterpartyAddresses(args, context);
      case 'counterparty_get_contact_persons':
        return await handleGetContactPersons(args, context);
      case 'counterparty_save':
        return await handleSaveCounterparty(args, context);
      case 'counterparty_update':
        return await handleUpdateCounterparty(args, context);
      case 'counterparty_delete':
        return await handleDeleteCounterparty(args, context);
      case 'counterparty_get_options':
        return await handleGetCounterpartyOptions(args, context);
      default:
        throw new Error(`Unknown counterparty tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Counterparty tool "${name}"`);
  }
}

async function handleGetCounterparties(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const counterpartyProperty = assertString(args?.CounterpartyProperty, 'CounterpartyProperty') as 'Sender' | 'Recipient' | 'ThirdPerson';
  const page = assertOptionalNumber(args?.Page, 'Page');
  const findByString = assertOptionalString(args?.FindByString, 'FindByString');
  const cityRef = assertOptionalString(args?.CityRef, 'CityRef');

  const response = await context.client.counterparty.getCounterparties({
    CounterpartyProperty: counterpartyProperty,
    ...(page !== undefined ? { Page: page } : {}),
    ...(findByString ? { FindByString: findByString } : {}),
    ...(cityRef ? { CityRef: cityRef } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get counterparties'));
  }

  const counterparties = response.data?.map(cp => ({
    ref: cp.Ref,
    description: cp.Description,
    city: cp.City,
    counterpartyType: cp.CounterpartyType,
    ownershipForm: cp.OwnershipForm,
    ownershipFormDescription: cp.OwnershipFormDescription,
    edrpou: cp.EDRPOU,
  })) ?? [];

  return createTextResult(
    formatAsJson({
      total: counterparties.length,
      counterparties
    })
  );
}

async function handleGetCounterpartyAddresses(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const counterpartyProperty = assertOptionalString(args?.CounterpartyProperty, 'CounterpartyProperty') as 'Sender' | 'Recipient' | undefined;
  const page = assertOptionalNumber(args?.Page, 'Page');

  const response = await context.client.counterparty.getCounterpartyAddresses({
    Ref: ref,
    ...(counterpartyProperty ? { CounterpartyProperty: counterpartyProperty } : {}),
    ...(page !== undefined ? { Page: page } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get counterparty addresses'));
  }

  const addresses = response.data?.map(address => ({
    ref: address.Ref,
    description: address.Description,
    streetsType: address.StreetsType,
    streetsTypeDescription: address.StreetsTypeDescription,
  })) ?? [];

  return createTextResult(
    formatAsJson({
      total: addresses.length,
      addresses
    })
  );
}

async function handleGetContactPersons(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const page = assertOptionalNumber(args?.Page, 'Page');

  const response = await context.client.counterparty.getCounterpartyContactPersons({
    Ref: ref,
    ...(page !== undefined ? { Page: page } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get contact persons'));
  }

  const contactPersons = response.data?.map(person => ({
    ref: person.Ref,
    description: person.Description,
    phones: person.Phones,
    email: person.Email,
    lastName: person.LastName,
    firstName: person.FirstName,
    middleName: person.MiddleName,
  })) ?? [];

  return createTextResult(
    formatAsJson({
      total: contactPersons.length,
      contactPersons
    })
  );
}

async function handleSaveCounterparty(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const counterpartyType = assertString(args?.CounterpartyType, 'CounterpartyType');
  const counterpartyProperty = assertString(args?.CounterpartyProperty, 'CounterpartyProperty') as 'Sender' | 'Recipient';
  const phone = assertString(args?.Phone, 'Phone');

  // Validate based on counterparty type
  if (counterpartyType === 'PrivatePerson') {
    const firstName = assertString(args?.FirstName, 'FirstName');
    const lastName = assertString(args?.LastName, 'LastName');
    const middleName = assertOptionalString(args?.MiddleName, 'MiddleName');
    const email = assertOptionalString(args?.Email, 'Email');

    const response = await context.client.counterparty.save({
      CounterpartyType: counterpartyType,
      CounterpartyProperty: counterpartyProperty,
      FirstName: firstName,
      LastName: lastName,
      ...(middleName !== undefined ? { MiddleName: middleName } : {}),
      Phone: phone,
      ...(email !== undefined ? { Email: email } : {}),
    });

    if (!response.success) {
      throw new Error(formatResponseErrors(response.errors, 'Failed to save counterparty'));
    }

    return createTextResult(
      formatAsJson({
        success: response.success,
        ref: response.data?.[0]?.Ref,
        description: response.data?.[0]?.Description,
      })
    );
  } else if (counterpartyType === 'Organization') {
    const ownershipForm = assertString(args?.OwnershipForm, 'OwnershipForm');
    const edrpou = assertString(args?.EDRPOU, 'EDRPOU');
    const firstNameOpt = assertOptionalString(args?.FirstName, 'FirstName');
    const lastNameOpt = assertOptionalString(args?.LastName, 'LastName');
    const middleNameOpt = assertOptionalString(args?.MiddleName, 'MiddleName');
    const emailOpt = assertOptionalString(args?.Email, 'Email');

    const response = await context.client.counterparty.save({
      CounterpartyType: counterpartyType,
      CounterpartyProperty: counterpartyProperty,
      OwnershipForm: ownershipForm,
      EDRPOU: edrpou,
      ...(firstNameOpt !== undefined ? { FirstName: firstNameOpt } : {}),
      ...(lastNameOpt !== undefined ? { LastName: lastNameOpt } : {}),
      ...(middleNameOpt !== undefined ? { MiddleName: middleNameOpt } : {}),
      Phone: phone,
      ...(emailOpt !== undefined ? { Email: emailOpt } : {}),
    });

    if (!response.success) {
      throw new Error(formatResponseErrors(response.errors, 'Failed to save counterparty'));
    }

    return createTextResult(
      formatAsJson({
        success: response.success,
        ref: response.data?.[0]?.Ref,
        description: response.data?.[0]?.Description,
      })
    );
  } else {
    throw new Error(`Invalid counterpartyType: ${counterpartyType}. Must be PrivatePerson or Organization.`);
  }
}

async function handleUpdateCounterparty(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const counterpartyProperty = assertString(args?.CounterpartyProperty, 'CounterpartyProperty') as 'Sender' | 'Recipient';
  const firstName = assertOptionalString(args?.FirstName, 'FirstName');
  const middleName = assertOptionalString(args?.MiddleName, 'MiddleName');
  const lastName = assertOptionalString(args?.LastName, 'LastName');
  const phone = assertOptionalString(args?.Phone, 'Phone');
  const email = assertOptionalString(args?.Email, 'Email');

  const response = await context.client.counterparty.update({
    Ref: ref,
    CounterpartyProperty: counterpartyProperty,
    ...(firstName !== undefined ? { FirstName: firstName } : {}),
    ...(middleName !== undefined ? { MiddleName: middleName } : {}),
    ...(lastName !== undefined ? { LastName: lastName } : {}),
    ...(phone !== undefined ? { Phone: phone } : {}),
    ...(email !== undefined ? { Email: email } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to update counterparty'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      ref: response.data?.[0]?.Ref,
      description: response.data?.[0]?.Description,
    })
  );
}

async function handleDeleteCounterparty(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');

  const response = await context.client.counterparty.delete({
    Ref: ref,
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to delete counterparty'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      message: 'Counterparty deleted successfully',
    })
  );
}

async function handleGetCounterpartyOptions(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');

  const response = await context.client.counterparty.getCounterpartyOptions({
    Ref: ref,
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get counterparty options'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      data: response.data?.[0],
    })
  );
}
