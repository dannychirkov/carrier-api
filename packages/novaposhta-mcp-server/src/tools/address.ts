import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types';

import type { ToolArguments, ToolContext } from '../types/mcp.js';
import { toErrorResult, formatResponseErrors } from '../utils/error-handler.js';
import { assertOptionalNumber, assertOptionalString, assertString } from '../utils/validation.js';
import { createTextResult, formatAsJson } from '../utils/tool-response.js';
const addressTools: Tool[] = [
  {
    name: 'address_get_settlements',
    description:
      'Get settlement areas (областей) via Address/getSettlementAreas (doc 1.3). Returns list of administrative regions/areas in Ukraine. Docs recommend caching this public directory for 12 hours.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Optional area reference to get specific area.' },
      },
      required: [],
    },
  },
  {
    name: 'address_get_settlement_country_region',
    description:
      'Get settlement country regions (регіонів) for a specific area via Address/getSettlementCountryRegion (doc 1.3). Returns list of regions within an administrative area. Requires areaRef parameter. Docs recommend caching for 12 hours.',
    inputSchema: {
      type: 'object',
      properties: {
        AreaRef: { type: 'string', description: 'Area reference from address_get_settlements.' },
        Ref: { type: 'string', description: 'Optional region reference to get specific region.' },
      },
      required: ['AreaRef'],
    },
  },
  {
    name: 'address_search_cities',
    description:
      'Find Nova Poshta cities by name or postal index using Address/getCities (doc 1.3). Docs note the city directory is public (no API key) but must be cached and refreshed daily because it exposes Area and Delivery1-Delivery7 flags. IMPORTANT: Always use limit parameter (recommended: 10) to avoid large responses.',
    inputSchema: {
      type: 'object',
      properties: {
        FindByString: { type: 'string', description: 'Partial city name or postal code.' },
        Page: { type: 'number', description: 'Page number (default 1).' },
        Limit: { type: 'number', description: 'Items per page (max 50). Recommended: 10 to avoid large responses.' },
      },
      required: ['FindByString'],
    },
  },
  {
    name: 'address_search_settlements',
    description:
      'Search for settlements (city, town, village) with pagination over the same Address/getCities dataset described in doc 1.3 (Area + Delivery1-Delivery7 fields, daily refresh recommended). IMPORTANT: Always use limit parameter (recommended: 10) to avoid large responses.',
    inputSchema: {
      type: 'object',
      properties: {
        CityName: { type: 'string', description: 'Settlement name or postal code.' },
        Page: { type: 'number', description: 'Page number (default 1).' },
        Limit: { type: 'number', description: 'Items per page (1-500). Recommended: 10 to avoid large responses.' },
      },
      required: ['CityName'],
    },
  },
  {
    name: 'address_search_streets',
    description:
      'Search for streets inside a settlement via Address/getStreet (doc 1.4). Used for door pickup/delivery flows, limited to 500 records per page, public but should be cached and refreshed daily. IMPORTANT: Always use limit parameter (recommended: 10) to avoid large responses.',
    inputSchema: {
      type: 'object',
      properties: {
        SettlementRef: { type: 'string', description: 'Settlement reference ID.' },
        StreetName: { type: 'string', description: 'Street name or fragment.' },
        Limit: { type: 'number', description: 'Max items to return. Recommended: 10 to avoid large responses.' },
      },
      required: ['SettlementRef', 'StreetName'],
    },
  },
  {
    name: 'address_get_warehouses',
    description:
      'List Nova Poshta warehouses (branches, postomats, pickup points) via Address/getWarehouses (doc 1.5). Docs emphasize caching the branch directory daily to leverage schedule arrays, max weight limits, and warehouse types without re-fetching thousands of rows. IMPORTANT: Always use limit parameter (recommended: 10-20) to avoid large responses.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Specific warehouse reference (returns single warehouse).' },
        CityName: { type: 'string', description: 'City name filter.' },
        CityRef: { type: 'string', description: 'City reference from getCities.' },
        SettlementRef: { type: 'string', description: 'Settlement reference from searchSettlements.' },
        WarehouseId: { type: 'string', description: 'Warehouse number (e.g., "1" for Branch #1).' },
        FindByString: { type: 'string', description: 'Search string for warehouse name, address, or street.' },
        TypeOfWarehouseRef: {
          type: 'string',
          description: 'Filter by warehouse type (Branch, Postomat, Pickup Point).',
        },
        BicycleParking: { type: 'string', description: 'Filter by bicycle parking availability (1/0).' },
        PostFinance: { type: 'string', description: 'Filter by NovaPay cash desk availability (1/0).' },
        POSTerminal: { type: 'string', description: 'Filter by POS terminal availability (1/0).' },
        Page: { type: 'number', description: 'Page number (default 1).' },
        Limit: {
          type: 'number',
          description: 'Items per page (default 50). Recommended: 10-20 to avoid large responses.',
        },
        Language: { type: 'string', description: 'Language code (UA, RU, EN).' },
      },
      required: [],
    },
  },
  {
    name: 'address_save',
    description:
      'Create new address for a counterparty via Address/save (doc 1.24). Requires API key plus CounterpartyRef, StreetRef, BuildingNumber; response returns the Ref and Description needed for door-to-door delivery.',
    inputSchema: {
      type: 'object',
      properties: {
        CounterpartyRef: { type: 'string', description: 'Counterparty reference.' },
        StreetRef: { type: 'string', description: 'Street reference from address_search_streets.' },
        BuildingNumber: { type: 'string', description: 'Building number (required).' },
        Flat: { type: 'string', description: 'Apartment number (optional).' },
        Note: { type: 'string', description: 'Additional note (optional).' },
      },
      required: ['CounterpartyRef', 'StreetRef', 'BuildingNumber'],
    },
  },
  {
    name: 'address_update',
    description:
      'Update existing counterparty address with Address/update (doc 1.25). Nova Poshta docs stress you can edit an address only until a waybill is created with it, so run this immediately after address creation.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Address reference to update.' },
        CounterpartyRef: { type: 'string', description: 'Counterparty reference.' },
        StreetRef: { type: 'string', description: 'Updated street reference.' },
        BuildingNumber: { type: 'string', description: 'Updated building number.' },
        Flat: { type: 'string', description: 'Updated apartment number.' },
        Note: { type: 'string', description: 'Updated note.' },
      },
      required: ['Ref', 'CounterpartyRef'],
    },
  },
  {
    name: 'address_delete',
    description:
      'Delete counterparty address by reference using Address/delete (doc 1.25). Allowed only before the address participates in an Internet document; afterward the API blocks deletion.',
    inputSchema: {
      type: 'object',
      properties: {
        Ref: { type: 'string', description: 'Address reference to delete.' },
      },
      required: ['Ref'],
    },
  },
];

export function getAddressTools(): Tool[] {
  return addressTools;
}

export async function handleAddressTool(
  name: string,
  args: ToolArguments,
  context: ToolContext,
): Promise<CallToolResult> {
  try {
    switch (name) {
      case 'address_get_settlements':
        return await handleGetSettlements(args, context);
      case 'address_get_settlement_country_region':
        return await handleGetSettlementCountryRegion(args, context);
      case 'address_search_cities':
        return await handleSearchCities(args, context);
      case 'address_search_settlements':
        return await handleSearchSettlements(args, context);
      case 'address_search_streets':
        return await handleSearchStreets(args, context);
      case 'address_get_warehouses':
        return await handleGetWarehouses(args, context);
      case 'address_save':
        return await handleSaveAddress(args, context);
      case 'address_update':
        return await handleUpdateAddress(args, context);
      case 'address_delete':
        return await handleDeleteAddress(args, context);
      default:
        throw new Error(`Unknown address tool: ${name}`);
    }
  } catch (error) {
    return toErrorResult(error, `Address tool "${name}"`);
  }
}

async function handleGetSettlements(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertOptionalString(args?.Ref, 'Ref');

  const response = await context.client.address.getSettlements({
    ...(ref ? { Ref: ref } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get settlements'));
  }

  const settlements = response.data?.map(settlement => ({
    ref: settlement.Ref,
    description: settlement.Description,
    areasCenter: settlement.AreasCenter,
  })) ?? [];

  return createTextResult(formatAsJson({ total: settlements.length, settlements }));
}

async function handleGetSettlementCountryRegion(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const areaRef = assertString(args?.AreaRef, 'AreaRef');
  const ref = assertOptionalString(args?.Ref, 'Ref');

  const response = await context.client.address.getSettlementCountryRegion({
    AreaRef: areaRef,
    ...(ref ? { Ref: ref } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to get settlement country regions'));
  }

  const regions = response.data?.map(region => ({
    ref: region.Ref,
    description: region.Description,
    regionType: region.RegionType,
    areasCenter: region.AreasCenter,
  })) ?? [];

  return createTextResult(formatAsJson({ total: regions.length, regions }));
}

async function handleSearchCities(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const query = assertString(args?.FindByString, 'FindByString');
  const page = assertOptionalNumber(args?.Page, 'Page') ?? 1;
  const limit = assertOptionalNumber(args?.Limit, 'Limit') ?? 10;

  const response = await context.client.address.getCities({
    FindByString: query,
    Page: page,
    Limit: limit,
  });

  const cities =
    response.data?.map(city => {
      const warehouses = (city as unknown as { Warehouses?: number }).Warehouses ?? 0;
      return {
        description: city.Description,
        ref: city.Ref,
        area: city.Area,
        warehouses: Number(warehouses),
      };
    }) ?? [];

  return createTextResult(formatAsJson({ total: cities.length, cities }));
}

async function handleSearchSettlements(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const cityName = assertString(args?.CityName, 'CityName');
  const page = assertOptionalNumber(args?.Page, 'Page') ?? 1;
  const limit = assertOptionalNumber(args?.Limit, 'Limit') ?? 10;

  const response = await context.client.address.searchSettlements({
    CityName: cityName,
    Page: page,
    Limit: limit,
  });

  const addresses = response.data?.[0]?.Addresses ?? [];
  const settlements = addresses.map(address => ({
    name: address.MainDescription,
    area: address.Area,
    region: address.Region,
    warehouses: address.Warehouses,
    settlementRef: address.Ref,
    deliveryCity: address.DeliveryCity,
  }));

  return createTextResult(formatAsJson({ total: settlements.length, settlements }));
}

async function handleSearchStreets(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const settlementRef = assertString(args?.SettlementRef, 'SettlementRef');
  const streetName = assertString(args?.StreetName, 'StreetName');
  const limit = assertOptionalNumber(args?.Limit, 'Limit') ?? 10;

  const response = await context.client.address.searchSettlementStreets({
    SettlementRef: settlementRef,
    StreetName: streetName,
    Limit: limit,
  });

  const addresses = response.data?.[0]?.Addresses ?? [];
  const streets = addresses.map(street => ({
    name: street.SettlementStreetDescription,
    ref: street.SettlementStreetRef,
    present: street.Present,
    location: street.Location,
    streetsType: street.StreetsType,
    streetsTypeDescription: street.StreetsTypeDescription,
  }));

  return createTextResult(formatAsJson({ total: streets.length, streets }));
}

async function handleGetWarehouses(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertOptionalString(args?.Ref, 'Ref');
  const cityName = assertOptionalString(args?.CityName, 'CityName');
  const cityRef = assertOptionalString(args?.CityRef, 'CityRef');
  const settlementRef = assertOptionalString(args?.SettlementRef, 'SettlementRef');
  const warehouseId = assertOptionalString(args?.WarehouseId, 'WarehouseId');
  const findByString = assertOptionalString(args?.FindByString, 'FindByString');
  const typeOfWarehouseRef = assertOptionalString(args?.TypeOfWarehouseRef, 'TypeOfWarehouseRef');
  const bicycleParking = assertOptionalString(args?.BicycleParking, 'BicycleParking');
  const postFinance = assertOptionalString(args?.PostFinance, 'PostFinance');
  const posTerminal = assertOptionalString(args?.POSTerminal, 'POSTerminal');
  const language = assertOptionalString(args?.Language, 'Language');
  const page = assertOptionalNumber(args?.Page, 'Page') ?? 1;
  const limit = assertOptionalNumber(args?.Limit, 'Limit') ?? 10;

  // Allow search by Ref without CityRef/SettlementRef
  if (!ref && !cityRef && !settlementRef) {
    throw new Error('Ref, CityRef, or SettlementRef is required to list warehouses');
  }

  const response = await context.client.address.getWarehouses({
    ...(ref ? { Ref: ref } : {}),
    ...(cityName ? { CityName: cityName } : {}),
    ...(cityRef ? { CityRef: cityRef } : {}),
    ...(settlementRef ? { SettlementRef: settlementRef } : {}),
    ...(warehouseId ? { WarehouseId: warehouseId } : {}),
    ...(findByString ? { FindByString: findByString } : {}),
    ...(typeOfWarehouseRef ? { TypeOfWarehouseRef: typeOfWarehouseRef } : {}),
    ...(bicycleParking ? { BicycleParking: bicycleParking } : {}),
    ...(postFinance ? { PostFinance: postFinance } : {}),
    ...(posTerminal ? { POSTerminal: posTerminal } : {}),
    ...(language ? { Language: language } : {}),
    Page: page,
    Limit: limit,
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Nova Poshta API returned an error'));
  }

  const data = response.data ?? [];

  return createTextResult(formatAsJson({ total: data.length, warehouses: data }));
}

async function handleSaveAddress(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const counterpartyRef = assertString(args?.CounterpartyRef, 'CounterpartyRef');
  const streetRef = assertString(args?.StreetRef, 'StreetRef');
  const buildingNumber = assertString(args?.BuildingNumber, 'BuildingNumber');
  const flat = assertOptionalString(args?.Flat, 'Flat');
  const note = assertOptionalString(args?.Note, 'Note');

  const response = await context.client.address.save({
    CounterpartyRef: counterpartyRef,
    StreetRef: streetRef,
    BuildingNumber: buildingNumber,
    ...(flat !== undefined ? { Flat: flat } : {}),
    ...(note !== undefined ? { Note: note } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to save address'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      ref: response.data?.[0]?.Ref,
      description: response.data?.[0]?.Description,
    }),
  );
}

async function handleUpdateAddress(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');
  const counterpartyRef = assertString(args?.CounterpartyRef, 'CounterpartyRef');

  const streetRef = assertString(args?.StreetRef, 'StreetRef');
  const buildingNumber = assertString(args?.BuildingNumber, 'BuildingNumber');
  const flat = assertOptionalString(args?.Flat, 'Flat');
  const note = assertOptionalString(args?.Note, 'Note');

  const response = await context.client.address.update({
    Ref: ref,
    CounterpartyRef: counterpartyRef,
    StreetRef: streetRef,
    BuildingNumber: buildingNumber,
    ...(flat !== undefined ? { Flat: flat } : {}),
    ...(note !== undefined ? { Note: note } : {}),
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to update address'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      ref: response.data?.[0]?.Ref,
      description: response.data?.[0]?.Description,
    }),
  );
}

async function handleDeleteAddress(args: ToolArguments, context: ToolContext): Promise<CallToolResult> {
  const ref = assertString(args?.Ref, 'Ref');

  const response = await context.client.address.delete({
    Ref: ref,
  });

  if (!response.success) {
    throw new Error(formatResponseErrors(response.errors, 'Failed to delete address'));
  }

  return createTextResult(
    formatAsJson({
      success: response.success,
      message: 'Address deleted successfully',
    }),
  );
}
