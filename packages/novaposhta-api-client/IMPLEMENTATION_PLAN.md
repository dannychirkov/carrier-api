# План реализации недостающих сервисов и методов Nova Poshta API Client

## Общая информация

**Дата создания:** 2025-11-20
**Статус:** В ожидании одобрения
**Версия:** 1.0

## Обзор архитектуры клиента

### Паттерн реализации сервисов

Каждый сервис следует единой архитектуре:

```typescript
export class ServiceName {
  readonly namespace = 'namespace' as const;
  private transport!: HttpTransport;
  private apiKey?: string;

  attach(ctx: ClientContext) {
    this.transport = toHttpTransport(ctx);
    this.apiKey = ctx.apiKey;
  }

  async methodName(request: MethodRequest): Promise<MethodResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ModelName,
      calledMethod: NovaPoshtaMethod.MethodName,
      methodProperties: {
        // Преобразование camelCase → PascalCase
        Field1: request.field1,
        Field2: request.field2,
      },
    };

    return await this.transport.request<MethodResponse['data']>(apiRequest);
  }
}
```

### Структура типов

1. **Request типы** - camelCase интерфейсы для пользовательского API:
```typescript
export interface GetMethodRequest {
  readonly field1?: string;
  readonly field2?: number;
}
```

2. **Data типы** - PascalCase интерфейсы (как приходят из API):
```typescript
export interface MethodData {
  readonly Ref: string;
  readonly Description: string;
}
```

3. **Response типы** - обертка над данными:
```typescript
export type MethodResponse = NovaPoshtaResponse<MethodData[]>;
```

---

## Этап 1: Добавление недостающих методов в enum

**Файл:** `src/types/enums.ts`

### Задачи:

1. Добавить новые методы в `NovaPoshtaMethod`:

```typescript
export enum NovaPoshtaMethod {
  // ... существующие методы

  // Common model methods (отсутствуют)
  GetTypesOfPayers = 'getTypesOfPayers',
  GetPaymentForms = 'getPaymentForms',
  GetTypesOfCounterparties = 'getTypesOfCounterparties',

  // Counterparty methods (отсутствуют)
  GetCounterparties = 'getCounterparties',
  GetCounterpartyAddresses = 'getCounterpartyAddresses',
  GetCounterpartyContactPersons = 'getCounterpartyContactPersons',
  GetCounterpartyOptions = 'getCounterpartyOptions',

  // Методы Save, Update, Delete уже есть и используются несколькими моделями
}
```

**Комментарий:** Методы `Save`, `Update`, `Delete` используются разными моделями (Counterparty, ContactPerson, Address), поэтому остаются общими.

**Файлы для изменения:**
- `src/types/enums.ts` (строки 19-58)

**Оценка:** 15 минут

---

## Этап 2: Расширение ReferenceService

**Файл:** `src/services/referenceService.ts`
**Файл типов:** `src/types/reference.ts`

### 2.1. Добавить типы (reference.ts)

```typescript
// =============================================================================
// TYPES OF PAYERS
// =============================================================================

export interface GetTypesOfPayersRequest {
  readonly language?: string;
}

export interface PayerTypeData {
  readonly Ref: string;
  readonly Description: string;
}

export type GetTypesOfPayersResponse = NovaPoshtaResponse<PayerTypeData[]>;

// =============================================================================
// PAYMENT FORMS
// =============================================================================

export interface GetPaymentFormsRequest {
  readonly language?: string;
}

export interface PaymentFormData {
  readonly Ref: string;
  readonly Description: string;
}

export type GetPaymentFormsResponse = NovaPoshtaResponse<PaymentFormData[]>;

// =============================================================================
// TYPES OF COUNTERPARTIES
// =============================================================================

export interface GetTypesOfCounterpartiesRequest {
  readonly language?: string;
}

export interface CounterpartyTypeData {
  readonly Ref: string;
  readonly Description: string;
}

export type GetTypesOfCounterpartiesResponse = NovaPoshtaResponse<CounterpartyTypeData[]>;
```

**Документация:**
- `getTypesOfPayers`: `docs/markdown/1_7_otrimati_spisok_vidv_ta_form_platnikv.md` (строки 1-35)
- `getPaymentForms`: `docs/markdown/1_7_otrimati_spisok_vidv_ta_form_platnikv.md` (строки 38-69)
- `getTypesOfCounterparties`: `docs/markdown/1_14_otrimati_spisok_tipv_kontragentv_vdpravnikv_me.md`

### 2.2. Добавить методы (referenceService.ts)

```typescript
/**
 * Get types of payers
 * @description Retrieves list of payer types (Sender/Recipient/ThirdPerson)
 * @cacheable 24 hours
 */
async getTypesOfPayers(request: GetTypesOfPayersRequest = {}): Promise<GetTypesOfPayersResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Common,
    calledMethod: NovaPoshtaMethod.GetTypesOfPayers,
    methodProperties: request as unknown as Record<string, unknown>,
  };

  return await this.transport.request<GetTypesOfPayersResponse['data']>(apiRequest);
}

/**
 * Get payment forms
 * @description Retrieves list of payment forms (Cash/NonCash)
 * @cacheable 24 hours
 */
async getPaymentForms(request: GetPaymentFormsRequest = {}): Promise<GetPaymentFormsResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Common,
    calledMethod: NovaPoshtaMethod.GetPaymentForms,
    methodProperties: request as unknown as Record<string, unknown>,
  };

  return await this.transport.request<GetPaymentFormsResponse['data']>(apiRequest);
}

/**
 * Get types of counterparties
 * @description Retrieves list of counterparty types (PrivatePerson/Organization)
 * @cacheable 24 hours
 */
async getTypesOfCounterparties(
  request: GetTypesOfCounterpartiesRequest = {}
): Promise<GetTypesOfCounterpartiesResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Common,
    calledMethod: NovaPoshtaMethod.GetTypesOfCounterparties,
    methodProperties: request as unknown as Record<string, unknown>,
  };

  return await this.transport.request<GetTypesOfCounterpartiesResponse['data']>(apiRequest);
}
```

### 2.3. Экспорт типов (index.ts)

Добавить в секцию Reference types:

```typescript
export type {
  // ... существующие экспорты
  GetTypesOfPayersRequest,
  GetTypesOfPayersResponse,
  PayerTypeData,
  GetPaymentFormsRequest,
  GetPaymentFormsResponse,
  PaymentFormData,
  GetTypesOfCounterpartiesRequest,
  GetTypesOfCounterpartiesResponse,
  CounterpartyTypeData,
} from './types/reference';
```

**Файлы для изменения:**
- `src/types/reference.ts` (добавить после строки 273)
- `src/services/referenceService.ts` (добавить после строки 268)
- `src/index.ts` (добавить в секцию Reference types)

**Оценка:** 1 час

---

## Этап 3: Расширение AddressService

**Файл:** `src/services/addressService.ts`
**Файл типов:** `src/types/address.ts`

### 3.1. Добавить типы (address.ts)

```typescript
// =============================================================================
// ADDRESS CRUD OPERATIONS
// =============================================================================

export interface SaveAddressRequest {
  readonly counterpartyRef: CounterpartyRef;
  readonly streetRef: StreetRef;
  readonly buildingNumber: string;
  readonly flat?: string;
  readonly note?: string;
}

export interface AddressData {
  readonly Ref: AddressRef;
  readonly Description: string;
}

export type SaveAddressResponse = NovaPoshtaResponse<AddressData[]>;

export interface UpdateAddressRequest {
  readonly ref: AddressRef;
  readonly counterpartyRef: CounterpartyRef;
  readonly streetRef: StreetRef;
  readonly buildingNumber: string;
  readonly flat?: string;
  readonly note?: string;
}

export type UpdateAddressResponse = NovaPoshtaResponse<AddressData[]>;

export interface DeleteAddressRequest {
  readonly ref: AddressRef;
}

export interface AddressDeletionData {
  readonly Ref: AddressRef;
}

export type DeleteAddressResponse = NovaPoshtaResponse<AddressDeletionData[]>;
```

**Документация:**
- `save`: `docs/markdown/1_24_stvorennya_adresi_vdpravnikaotrimuvacha_metod_.md`
- `update`: `docs/markdown/1_25_onovlennyavidalennya_adresi_kontragenta_vdprav.md` (строки 1-54)
- `delete`: `docs/markdown/1_25_onovlennyavidalennya_adresi_kontragenta_vdprav.md` (строки 58-92)

### 3.2. Добавить методы (addressService.ts)

```typescript
/**
 * Save address
 * @description Creates a new address for sender or recipient
 */
async save(request: SaveAddressRequest): Promise<SaveAddressResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Address,
    calledMethod: NovaPoshtaMethod.Save,
    methodProperties: {
      CounterpartyRef: request.counterpartyRef,
      StreetRef: request.streetRef,
      BuildingNumber: request.buildingNumber,
      Flat: request.flat,
      Note: request.note,
    },
  };

  return await this.transport.request<SaveAddressResponse['data']>(apiRequest);
}

/**
 * Update address
 * @description Updates an existing address
 */
async update(request: UpdateAddressRequest): Promise<UpdateAddressResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Address,
    calledMethod: NovaPoshtaMethod.Update,
    methodProperties: {
      Ref: request.ref,
      CounterpartyRef: request.counterpartyRef,
      StreetRef: request.streetRef,
      BuildingNumber: request.buildingNumber,
      Flat: request.flat,
      Note: request.note,
    },
  };

  return await this.transport.request<UpdateAddressResponse['data']>(apiRequest);
}

/**
 * Delete address
 * @description Deletes an address by reference
 */
async delete(request: DeleteAddressRequest): Promise<DeleteAddressResponse> {
  const apiRequest: NovaPoshtaRequest = {
    ...(this.apiKey ? { apiKey: this.apiKey } : {}),
    modelName: NovaPoshtaModel.Address,
    calledMethod: NovaPoshtaMethod.Delete,
    methodProperties: {
      Ref: request.ref,
    },
  };

  return await this.transport.request<DeleteAddressResponse['data']>(apiRequest);
}
```

### 3.3. Экспорт типов (index.ts)

Добавить в секцию Address types:

```typescript
export type {
  // ... существующие экспорты
  SaveAddressRequest,
  SaveAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  DeleteAddressRequest,
  DeleteAddressResponse,
  AddressDeletionData,
} from './types/address';
```

**Файлы для изменения:**
- `src/types/address.ts` (добавить после строки 363)
- `src/services/addressService.ts` (добавить после строки 201)
- `src/index.ts` (добавить в секцию Address types)

**Оценка:** 1 час

---

## Этап 4: Создание CounterpartyService

**Новые файлы:**
- `src/services/counterpartyService.ts`
- `src/types/counterparty.ts`

### 4.1. Создать файл типов (counterparty.ts)

```typescript
/**
 * Counterparty service types for Nova Poshta API
 * Handles all counterparty-related operations (senders and recipients)
 */

import type { NovaPoshtaResponse, CounterpartyRef, CityRef, AddressRef, ContactRef } from './base';

// =============================================================================
// GET COUNTERPARTIES
// =============================================================================

export interface GetCounterpartiesRequest {
  readonly counterpartyProperty: 'Sender' | 'Recipient' | 'ThirdPerson';
  readonly page?: number;
  readonly findByString?: string;
  readonly cityRef?: CityRef;
}

export interface CounterpartyData {
  readonly Description: string;
  readonly Ref: CounterpartyRef;
  readonly City: CityRef;
  readonly Counterparty: string;
  readonly OwnershipForm: string;
  readonly OwnershipFormDescription: string;
  readonly EDRPOU: string;
  readonly CounterpartyType: string;
}

export type GetCounterpartiesResponse = NovaPoshtaResponse<CounterpartyData[]>;

// =============================================================================
// GET COUNTERPARTY ADDRESSES
// =============================================================================

export interface GetCounterpartyAddressesRequest {
  readonly ref: CounterpartyRef;
  readonly counterpartyProperty?: 'Sender' | 'Recipient';
  readonly page?: number;
}

export interface CounterpartyAddressData {
  readonly Ref: AddressRef;
  readonly Description: string;
  readonly StreetsType: string;
  readonly StreetsTypeDescription: string;
}

export type GetCounterpartyAddressesResponse = NovaPoshtaResponse<CounterpartyAddressData[]>;

// =============================================================================
// GET COUNTERPARTY CONTACT PERSONS
// =============================================================================

export interface GetCounterpartyContactPersonsRequest {
  readonly ref: CounterpartyRef;
  readonly page?: number;
}

export interface CounterpartyContactPersonData {
  readonly Description: string;
  readonly Ref: ContactRef;
  readonly Phones: string;
  readonly Email: string;
  readonly LastName: string;
  readonly FirstName: string;
  readonly MiddleName: string;
}

export type GetCounterpartyContactPersonsResponse = NovaPoshtaResponse<CounterpartyContactPersonData[]>;

// =============================================================================
// SAVE COUNTERPARTY
// =============================================================================

export interface SaveCounterpartyRequest {
  readonly counterpartyType: 'PrivatePerson' | 'Organization';
  readonly counterpartyProperty: 'Sender' | 'Recipient';
  readonly firstName?: string;
  readonly middleName?: string;
  readonly lastName?: string;
  readonly phone: string;
  readonly email?: string;
  readonly ownershipForm?: string;
  readonly edrpou?: string;
  readonly cityRef?: CityRef;
}

export interface SaveCounterpartyData {
  readonly Ref: CounterpartyRef;
  readonly Description: string;
  readonly ContactPerson: {
    readonly data: Array<{
      readonly Ref: ContactRef;
      readonly Description: string;
    }>;
  };
}

export type SaveCounterpartyResponse = NovaPoshtaResponse<SaveCounterpartyData[]>;

// =============================================================================
// UPDATE COUNTERPARTY
// =============================================================================

export interface UpdateCounterpartyRequest {
  readonly ref: CounterpartyRef;
  readonly counterpartyProperty: 'Sender' | 'Recipient';
  readonly firstName?: string;
  readonly middleName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly cityRef?: CityRef;
}

export type UpdateCounterpartyResponse = NovaPoshtaResponse<CounterpartyData[]>;

// =============================================================================
// DELETE COUNTERPARTY
// =============================================================================

export interface DeleteCounterpartyRequest {
  readonly ref: CounterpartyRef;
}

export interface DeleteCounterpartyData {
  readonly Ref: CounterpartyRef;
}

export type DeleteCounterpartyResponse = NovaPoshtaResponse<DeleteCounterpartyData[]>;

// =============================================================================
// GET COUNTERPARTY OPTIONS
// =============================================================================

export interface GetCounterpartyOptionsRequest {
  readonly ref: CounterpartyRef;
}

export interface CounterpartyOptionsData {
  readonly CanPayTheThirdPerson: string;
  readonly CanCreditDocuments: string;
  readonly CanEWTransporter: string;
  readonly DescentFromFloor: string;
  readonly CanBackwardDelivery: string;
  readonly CanForwardingService: string;
  readonly PrintMarkingAllowedNonCash: string;
  readonly DebtorParams: {
    readonly DayDelay: string;
    readonly DebtCurrency: string;
    readonly Debt: string;
    readonly OverdueDebt: string;
  };
}

export type GetCounterpartyOptionsResponse = NovaPoshtaResponse<CounterpartyOptionsData[]>;

// =============================================================================
// AGGREGATE TYPES
// =============================================================================

export type CounterpartyRequest =
  | GetCounterpartiesRequest
  | GetCounterpartyAddressesRequest
  | GetCounterpartyContactPersonsRequest
  | SaveCounterpartyRequest
  | UpdateCounterpartyRequest
  | DeleteCounterpartyRequest
  | GetCounterpartyOptionsRequest;

export type CounterpartyResponse =
  | GetCounterpartiesResponse
  | GetCounterpartyAddressesResponse
  | GetCounterpartyContactPersonsResponse
  | SaveCounterpartyResponse
  | UpdateCounterpartyResponse
  | DeleteCounterpartyResponse
  | GetCounterpartyOptionsResponse;
```

**Документация:**
- `getCounterparties`, `getCounterpartyAddresses`, `getCounterpartyContactPersons`: `docs/markdown/1_7_zavantazhiti_spisok_kontragentv_vdpravnikvoderz.md`
- `save`: `docs/markdown/1_20_zberezhennya_kontragenta_metod_save.md`
- `update`, `delete`: `docs/markdown/1_22_onoviti_dan_kontragenta_metod_update.md`
- `getCounterpartyOptions`: `docs/markdown/1_23_zavantazhiti_parametri_kontragenta_metod_getco.md`

### 4.2. Создать файл сервиса (counterpartyService.ts)

```typescript
/**
 * Counterparty service for Nova Poshta API
 * Handles all counterparty-related operations
 */

import type { HttpTransport } from '../http/transport';
import type { ClientContext } from '../core/client';
import { toHttpTransport } from '../core/client';
import type {
  GetCounterpartiesRequest,
  GetCounterpartiesResponse,
  GetCounterpartyAddressesRequest,
  GetCounterpartyAddressesResponse,
  GetCounterpartyContactPersonsRequest,
  GetCounterpartyContactPersonsResponse,
  SaveCounterpartyRequest,
  SaveCounterpartyResponse,
  UpdateCounterpartyRequest,
  UpdateCounterpartyResponse,
  DeleteCounterpartyRequest,
  DeleteCounterpartyResponse,
  GetCounterpartyOptionsRequest,
  GetCounterpartyOptionsResponse,
} from '../types/counterparty';
import type { NovaPoshtaRequest } from '../types/base';
import { NovaPoshtaModel, NovaPoshtaMethod } from '../types/enums';

/**
 * Service for managing counterparty operations
 *
 * @example
 * ```typescript
 * // Get counterparties
 * const senders = await counterpartyService.getCounterparties({
 *   counterpartyProperty: 'Sender',
 *   page: 1
 * });
 *
 * // Create counterparty
 * const newCounterparty = await counterpartyService.save({
 *   counterpartyType: 'PrivatePerson',
 *   counterpartyProperty: 'Recipient',
 *   firstName: 'Іван',
 *   lastName: 'Петренко',
 *   phone: '380501234567'
 * });
 * ```
 */
export class CounterpartyService {
  readonly namespace = 'counterparty' as const;
  private transport!: HttpTransport;
  private apiKey?: string;

  attach(ctx: ClientContext) {
    this.transport = toHttpTransport(ctx);
    this.apiKey = ctx.apiKey;
  }

  /**
   * Get counterparties
   * @description Retrieves list of counterparties (senders or recipients)
   * @cacheable 1 hour
   */
  async getCounterparties(request: GetCounterpartiesRequest): Promise<GetCounterpartiesResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.GetCounterparties,
      methodProperties: {
        CounterpartyProperty: request.counterpartyProperty,
        Page: request.page?.toString(),
        FindByString: request.findByString,
        CityRef: request.cityRef,
      },
    };

    return await this.transport.request<GetCounterpartiesResponse['data']>(apiRequest);
  }

  /**
   * Get counterparty addresses
   * @description Retrieves list of addresses for a specific counterparty
   * @cacheable 1 hour
   */
  async getCounterpartyAddresses(
    request: GetCounterpartyAddressesRequest,
  ): Promise<GetCounterpartyAddressesResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.GetCounterpartyAddresses,
      methodProperties: {
        Ref: request.ref,
        CounterpartyProperty: request.counterpartyProperty,
        Page: request.page?.toString(),
      },
    };

    return await this.transport.request<GetCounterpartyAddressesResponse['data']>(apiRequest);
  }

  /**
   * Get counterparty contact persons
   * @description Retrieves list of contact persons for a specific counterparty
   * @cacheable 1 hour
   */
  async getCounterpartyContactPersons(
    request: GetCounterpartyContactPersonsRequest,
  ): Promise<GetCounterpartyContactPersonsResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.GetCounterpartyContactPersons,
      methodProperties: {
        Ref: request.ref,
        Page: request.page?.toString(),
      },
    };

    return await this.transport.request<GetCounterpartyContactPersonsResponse['data']>(apiRequest);
  }

  /**
   * Save counterparty
   * @description Creates a new counterparty (sender or recipient)
   */
  async save(request: SaveCounterpartyRequest): Promise<SaveCounterpartyResponse> {
    const methodProperties: Record<string, string | undefined> = {
      CounterpartyType: request.counterpartyType,
      CounterpartyProperty: request.counterpartyProperty,
      Phone: request.phone,
    };

    // Add optional fields based on counterparty type
    if (request.counterpartyType === 'PrivatePerson') {
      methodProperties.FirstName = request.firstName;
      methodProperties.MiddleName = request.middleName;
      methodProperties.LastName = request.lastName;
    }

    if (request.email) methodProperties.Email = request.email;
    if (request.ownershipForm) methodProperties.OwnershipForm = request.ownershipForm;
    if (request.edrpou) methodProperties.EDRPOU = request.edrpou;
    if (request.cityRef) methodProperties.CityRef = request.cityRef;

    // Remove undefined values
    const cleanProperties = Object.fromEntries(
      Object.entries(methodProperties).filter(([, value]) => value !== undefined),
    );

    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.Save,
      methodProperties: cleanProperties,
    };

    return await this.transport.request<SaveCounterpartyResponse['data']>(apiRequest);
  }

  /**
   * Update counterparty
   * @description Updates an existing counterparty
   */
  async update(request: UpdateCounterpartyRequest): Promise<UpdateCounterpartyResponse> {
    const methodProperties: Record<string, string | undefined> = {
      Ref: request.ref,
      CounterpartyProperty: request.counterpartyProperty,
    };

    if (request.firstName) methodProperties.FirstName = request.firstName;
    if (request.middleName) methodProperties.MiddleName = request.middleName;
    if (request.lastName) methodProperties.LastName = request.lastName;
    if (request.phone) methodProperties.Phone = request.phone;
    if (request.email) methodProperties.Email = request.email;
    if (request.cityRef) methodProperties.CityRef = request.cityRef;

    // Remove undefined values
    const cleanProperties = Object.fromEntries(
      Object.entries(methodProperties).filter(([, value]) => value !== undefined),
    );

    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.Update,
      methodProperties: cleanProperties,
    };

    return await this.transport.request<UpdateCounterpartyResponse['data']>(apiRequest);
  }

  /**
   * Delete counterparty
   * @description Deletes a counterparty by reference (only recipients)
   */
  async delete(request: DeleteCounterpartyRequest): Promise<DeleteCounterpartyResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.Delete,
      methodProperties: {
        Ref: request.ref,
      },
    };

    return await this.transport.request<DeleteCounterpartyResponse['data']>(apiRequest);
  }

  /**
   * Get counterparty options
   * @description Retrieves options and settings for a specific counterparty
   * @cacheable 1 hour
   */
  async getCounterpartyOptions(
    request: GetCounterpartyOptionsRequest,
  ): Promise<GetCounterpartyOptionsResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.Counterparty,
      calledMethod: NovaPoshtaMethod.GetCounterpartyOptions,
      methodProperties: {
        Ref: request.ref,
      },
    };

    return await this.transport.request<GetCounterpartyOptionsResponse['data']>(apiRequest);
  }
}
```

### 4.3. Экспорт (index.ts)

```typescript
// Добавить импорт сервиса
export { CounterpartyService } from './services/counterpartyService';

// Добавить типы в новую секцию
// Counterparty types
export type {
  GetCounterpartiesRequest,
  GetCounterpartiesResponse,
  CounterpartyData,
  GetCounterpartyAddressesRequest,
  GetCounterpartyAddressesResponse,
  CounterpartyAddressData,
  GetCounterpartyContactPersonsRequest,
  GetCounterpartyContactPersonsResponse,
  CounterpartyContactPersonData,
  SaveCounterpartyRequest,
  SaveCounterpartyResponse,
  SaveCounterpartyData,
  UpdateCounterpartyRequest,
  UpdateCounterpartyResponse,
  DeleteCounterpartyRequest,
  DeleteCounterpartyResponse,
  DeleteCounterpartyData,
  GetCounterpartyOptionsRequest,
  GetCounterpartyOptionsResponse,
  CounterpartyOptionsData,
  CounterpartyRequest,
  CounterpartyResponse,
} from './types/counterparty';
```

**Новые файлы:**
- `src/types/counterparty.ts` (новый файл ~250 строк)
- `src/services/counterpartyService.ts` (новый файл ~230 строк)

**Файлы для изменения:**
- `src/index.ts` (добавить экспорты)

**Оценка:** 3 часа

---

## Этап 5: Создание ContactPersonService

**Новые файлы:**
- `src/services/contactPersonService.ts`
- `src/types/contactPerson.ts`

### 5.1. Создать файл типов (contactPerson.ts)

```typescript
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

export type ContactPersonRequest =
  | SaveContactPersonRequest
  | UpdateContactPersonRequest
  | DeleteContactPersonRequest;

export type ContactPersonResponse =
  | SaveContactPersonResponse
  | UpdateContactPersonResponse
  | DeleteContactPersonResponse;
```

**Документация:**
- `save`: `docs/markdown/1_26_zberezhennya_danih_kontaktno_osobi_vdpravnikao.md`
- `update`: `docs/markdown/1_27_onovlennyaredaguvannya_danih_kontaktno_osobi_k.md` (строки 1-64)
- `delete`: `docs/markdown/1_27_onovlennyaredaguvannya_danih_kontaktno_osobi_k.md` (строки 68-103)

### 5.2. Создать файл сервиса (contactPersonService.ts)

```typescript
/**
 * Contact person service for Nova Poshta API
 * Handles all contact person-related operations
 */

import type { HttpTransport } from '../http/transport';
import type { ClientContext } from '../core/client';
import { toHttpTransport } from '../core/client';
import type {
  SaveContactPersonRequest,
  SaveContactPersonResponse,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
  DeleteContactPersonRequest,
  DeleteContactPersonResponse,
} from '../types/contactPerson';
import type { NovaPoshtaRequest } from '../types/base';
import { NovaPoshtaModel, NovaPoshtaMethod } from '../types/enums';

/**
 * Service for managing contact person operations
 *
 * @example
 * ```typescript
 * // Create contact person
 * const contact = await contactPersonService.save({
 *   counterpartyRef: 'counterparty-ref',
 *   firstName: 'Іван',
 *   lastName: 'Петренко',
 *   phone: '380501234567'
 * });
 *
 * // Update contact person
 * await contactPersonService.update({
 *   ref: 'contact-ref',
 *   counterpartyRef: 'counterparty-ref',
 *   email: 'ivan@example.com'
 * });
 * ```
 */
export class ContactPersonService {
  readonly namespace = 'contactPerson' as const;
  private transport!: HttpTransport;
  private apiKey?: string;

  attach(ctx: ClientContext) {
    this.transport = toHttpTransport(ctx);
    this.apiKey = ctx.apiKey;
  }

  /**
   * Save contact person
   * @description Creates a new contact person for a counterparty
   */
  async save(request: SaveContactPersonRequest): Promise<SaveContactPersonResponse> {
    const methodProperties: Record<string, string | undefined> = {
      CounterpartyRef: request.counterpartyRef,
      FirstName: request.firstName,
      LastName: request.lastName,
      Phone: request.phone,
    };

    if (request.middleName) methodProperties.MiddleName = request.middleName;
    if (request.email) methodProperties.Email = request.email;

    // Remove undefined values
    const cleanProperties = Object.fromEntries(
      Object.entries(methodProperties).filter(([, value]) => value !== undefined),
    );

    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ContactPerson,
      calledMethod: NovaPoshtaMethod.Save,
      methodProperties: cleanProperties,
    };

    return await this.transport.request<SaveContactPersonResponse['data']>(apiRequest);
  }

  /**
   * Update contact person
   * @description Updates an existing contact person
   */
  async update(request: UpdateContactPersonRequest): Promise<UpdateContactPersonResponse> {
    const methodProperties: Record<string, string | undefined> = {
      Ref: request.ref,
      CounterpartyRef: request.counterpartyRef,
    };

    if (request.firstName) methodProperties.FirstName = request.firstName;
    if (request.middleName) methodProperties.MiddleName = request.middleName;
    if (request.lastName) methodProperties.LastName = request.lastName;
    if (request.phone) methodProperties.Phone = request.phone;
    if (request.email) methodProperties.Email = request.email;

    // Remove undefined values
    const cleanProperties = Object.fromEntries(
      Object.entries(methodProperties).filter(([, value]) => value !== undefined),
    );

    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ContactPerson,
      calledMethod: NovaPoshtaMethod.Update,
      methodProperties: cleanProperties,
    };

    return await this.transport.request<UpdateContactPersonResponse['data']>(apiRequest);
  }

  /**
   * Delete contact person
   * @description Deletes a contact person by reference
   */
  async delete(request: DeleteContactPersonRequest): Promise<DeleteContactPersonResponse> {
    const apiRequest: NovaPoshtaRequest = {
      ...(this.apiKey ? { apiKey: this.apiKey } : {}),
      modelName: NovaPoshtaModel.ContactPerson,
      calledMethod: NovaPoshtaMethod.Delete,
      methodProperties: {
        Ref: request.ref,
        CounterpartyRef: request.counterpartyRef,
      },
    };

    return await this.transport.request<DeleteContactPersonResponse['data']>(apiRequest);
  }
}
```

### 5.3. Экспорт (index.ts)

```typescript
// Добавить импорт сервиса
export { ContactPersonService } from './services/contactPersonService';

// Добавить типы в новую секцию
// Contact person types
export type {
  SaveContactPersonRequest,
  SaveContactPersonResponse,
  ContactPersonData,
  UpdateContactPersonRequest,
  UpdateContactPersonResponse,
  DeleteContactPersonRequest,
  DeleteContactPersonResponse,
  DeleteContactPersonData,
  ContactPersonRequest,
  ContactPersonResponse,
} from './types/contactPerson';
```

**Новые файлы:**
- `src/types/contactPerson.ts` (новый файл ~100 строк)
- `src/services/contactPersonService.ts` (новый файл ~150 строк)

**Файлы для изменения:**
- `src/index.ts` (добавить экспорты)

**Оценка:** 2 часа

---

## Этап 6: Тестирование

### 6.1. Unit тесты

Создать тестовые файлы для каждого сервиса (если еще нет структуры тестов):

```typescript
// tests/services/counterpartyService.test.ts
// tests/services/contactPersonService.test.ts
// tests/services/addressService.test.ts (дополнительные тесты)
// tests/services/referenceService.test.ts (дополнительные тесты)
```

**Тестовые сценарии:**

1. **CounterpartyService:**
   - Получение списка контрагентов
   - Создание контрагента (физическое лицо)
   - Создание контрагента (организация)
   - Обновление контрагента
   - Удаление контрагента
   - Получение адресов контрагента
   - Получение контактных лиц контрагента
   - Получение опций контрагента

2. **ContactPersonService:**
   - Создание контактной особы
   - Обновление контактной особы
   - Удаление контактной особы

3. **AddressService (новые методы):**
   - Создание адреса
   - Обновление адреса
   - Удаление адреса

4. **ReferenceService (новые методы):**
   - Получение типов плательщиков
   - Получение форм оплаты
   - Получение типов контрагентов

**Оценка:** 4 часа

### 6.2. Интеграционные тесты

Тесты с использованием реального API (опционально, требуют тестовый ключ):

```typescript
// tests/integration/counterparty.integration.test.ts
// tests/integration/contactPerson.integration.test.ts
```

**Оценка:** 2 часа

---

## Этап 7: Документация

### 7.1. Обновить README

Добавить примеры использования новых сервисов:

```markdown
## Counterparty Management

### Get Counterparties
\`\`\`typescript
const senders = await client.counterparty.getCounterparties({
  counterpartyProperty: 'Sender',
  page: 1
});
\`\`\`

### Create Counterparty
\`\`\`typescript
const newRecipient = await client.counterparty.save({
  counterpartyType: 'PrivatePerson',
  counterpartyProperty: 'Recipient',
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '380501234567'
});
\`\`\`

## Contact Person Management

### Create Contact Person
\`\`\`typescript
const contact = await client.contactPerson.save({
  counterpartyRef: 'counterparty-ref',
  firstName: 'Марія',
  lastName: 'Коваленко',
  phone: '380671234567'
});
\`\`\`

## Address Management

### Create Address
\`\`\`typescript
const address = await client.address.save({
  counterpartyRef: 'counterparty-ref',
  streetRef: 'street-ref',
  buildingNumber: '10',
  flat: '5'
});
\`\`\`
```

### 7.2. Обновить CHANGELOG

```markdown
## [Unreleased]

### Added
- CounterpartyService with full CRUD operations
- ContactPersonService with full CRUD operations
- AddressService: save, update, delete methods
- ReferenceService: getTypesOfPayers, getPaymentForms, getTypesOfCounterparties methods
- Comprehensive TypeScript types for all new methods

### Changed
- Extended NovaPoshtaMethod enum with missing methods
```

**Оценка:** 1 час

---

## Сводка по этапам

| Этап | Описание | Оценка времени | Приоритет |
|------|----------|----------------|-----------|
| 1 | Добавление методов в enum | 15 мин | Высокий |
| 2 | Расширение ReferenceService | 1 час | Высокий |
| 3 | Расширение AddressService | 1 час | Средний |
| 4 | Создание CounterpartyService | 3 часа | Критичный |
| 5 | Создание ContactPersonService | 2 часа | Высокий |
| 6 | Тестирование | 6 часов | Высокий |
| 7 | Документация | 1 час | Средний |

**Общая оценка:** ~14-16 часов работы

---

## Порядок реализации

### Рекомендуемая последовательность:

1. **Этап 1** → **Этап 4** → **Этап 5** (критичные сервисы)
2. **Этап 2** → **Этап 3** (дополнительные методы)
3. **Этап 6** (тестирование всех изменений)
4. **Этап 7** (документация)

### Альтернативная последовательность (пошаговая):

Каждый этап завершается с тестами и документацией:

1. Этап 1 + Этап 2 + тесты + документация
2. Этап 3 + тесты + документация
3. Этап 4 + тесты + документация
4. Этап 5 + тесты + документация

---

## Checklist

### Этап 1: Enums
- [ ] Добавить `GetTypesOfPayers` в `NovaPoshtaMethod`
- [ ] Добавить `GetPaymentForms` в `NovaPoshtaMethod`
- [ ] Добавить `GetTypesOfCounterparties` в `NovaPoshtaMethod`
- [ ] Добавить `GetCounterparties` в `NovaPoshtaMethod`
- [ ] Добавить `GetCounterpartyAddresses` в `NovaPoshtaMethod`
- [ ] Добавить `GetCounterpartyContactPersons` в `NovaPoshtaMethod`
- [ ] Добавить `GetCounterpartyOptions` в `NovaPoshtaMethod`

### Этап 2: ReferenceService
- [ ] Создать типы Request/Response для `getTypesOfPayers`
- [ ] Создать типы Request/Response для `getPaymentForms`
- [ ] Создать типы Request/Response для `getTypesOfCounterparties`
- [ ] Реализовать метод `getTypesOfPayers`
- [ ] Реализовать метод `getPaymentForms`
- [ ] Реализовать метод `getTypesOfCounterparties`
- [ ] Экспортировать типы в `index.ts`
- [ ] Написать unit тесты

### Этап 3: AddressService
- [ ] Создать типы для `save`, `update`, `delete`
- [ ] Реализовать метод `save`
- [ ] Реализовать метод `update`
- [ ] Реализовать метод `delete`
- [ ] Экспортировать типы в `index.ts`
- [ ] Написать unit тесты

### Этап 4: CounterpartyService
- [ ] Создать файл `src/types/counterparty.ts`
- [ ] Создать все необходимые типы
- [ ] Создать файл `src/services/counterpartyService.ts`
- [ ] Реализовать метод `getCounterparties`
- [ ] Реализовать метод `getCounterpartyAddresses`
- [ ] Реализовать метод `getCounterpartyContactPersons`
- [ ] Реализовать метод `save`
- [ ] Реализовать метод `update`
- [ ] Реализовать метод `delete`
- [ ] Реализовать метод `getCounterpartyOptions`
- [ ] Экспортировать сервис и типы в `index.ts`
- [ ] Написать unit тесты
- [ ] Написать интеграционные тесты (опционально)

### Этап 5: ContactPersonService
- [ ] Создать файл `src/types/contactPerson.ts`
- [ ] Создать все необходимые типы
- [ ] Создать файл `src/services/contactPersonService.ts`
- [ ] Реализовать метод `save`
- [ ] Реализовать метод `update`
- [ ] Реализовать метод `delete`
- [ ] Экспортировать сервис и типы в `index.ts`
- [ ] Написать unit тесты
- [ ] Написать интеграционные тесты (опционально)

### Этап 6: Тестирование
- [ ] Проверить все unit тесты
- [ ] Проверить интеграционные тесты
- [ ] Проверить покрытие кода тестами
- [ ] Проверить типы TypeScript

### Этап 7: Документация
- [ ] Обновить README с примерами
- [ ] Обновить CHANGELOG
- [ ] Проверить JSDoc комментарии
- [ ] Создать примеры использования

---

## Риски и ограничения

### Технические риски:

1. **API changes**: Документация может быть устаревшей - необходимо проверить актуальность через тестовые запросы
2. **Field validation**: Некоторые поля могут быть обязательными в API, но не указаны в документации
3. **Type mismatches**: Возможны несоответствия типов между документацией и реальным API

### Меры минимизации:

1. Начать с интеграционных тестов для проверки API
2. Использовать опциональные поля где возможно
3. Добавить подробные JSDoc комментарии с требованиями к полям

### Известные ограничения:

1. Метод `delete` для Counterparty работает только для получателей (Recipient)
2. Некоторые поля зависят от `counterpartyType` (PrivatePerson vs Organization)

---

## Примеры использования после реализации

### Полный workflow создания накладной:

```typescript
import { createClient } from '@novaposhta/client';
import { CounterpartyService } from '@novaposhta/client';
import { ContactPersonService } from '@novaposhta/client';
import { AddressService } from '@novaposhta/client';
import { WaybillService } from '@novaposhta/client';

// Initialize client
const client = createClient({
  apiKey: process.env.NOVA_POSHTA_API_KEY!,
  baseUrl: 'https://api.novaposhta.ua/v2.0/json/'
})
  .use(new CounterpartyService())
  .use(new ContactPersonService())
  .use(new AddressService())
  .use(new WaybillService());

// 1. Create recipient
const recipient = await client.counterparty.save({
  counterpartyType: 'PrivatePerson',
  counterpartyProperty: 'Recipient',
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '380501234567',
  email: 'ivan@example.com'
});

// 2. Create contact person (if needed)
const contact = await client.contactPerson.save({
  counterpartyRef: recipient.data[0].Ref,
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '380501234567'
});

// 3. Create address
const address = await client.address.save({
  counterpartyRef: recipient.data[0].Ref,
  streetRef: 'street-ref-from-search',
  buildingNumber: '10',
  flat: '5'
});

// 4. Create waybill
const waybill = await client.waybill.create({
  payerType: 'Sender',
  paymentMethod: 'Cash',
  dateTime: '25.12.2024',
  cargoType: 'Parcel',
  weight: 1.5,
  serviceType: 'WarehouseWarehouse',
  seatsAmount: 1,
  description: 'Test package',
  cost: 1000,
  citySender: 'sender-city-ref',
  sender: 'sender-ref',
  senderAddress: 'sender-address-ref',
  contactSender: 'sender-contact-ref',
  sendersPhone: '380501234567',
  cityRecipient: 'recipient-city-ref',
  recipient: recipient.data[0].Ref,
  recipientAddress: address.data[0].Ref,
  contactRecipient: contact.data[0].Ref,
  recipientsPhone: '380501234567',
});
```

---

## Вопросы для уточнения

1. Нужны ли интеграционные тесты с реальным API?
2. Следует ли добавить валидацию полей на уровне клиента?
3. Нужна ли поддержка batch операций для создания нескольких контрагентов?
4. Требуется ли кэширование для методов получения справочников?

---

**Статус:** План готов к реализации
**Следующий шаг:** Одобрение плана и начало реализации с Этапа 1
