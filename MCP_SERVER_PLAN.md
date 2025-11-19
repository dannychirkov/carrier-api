# План создания MCP сервера для Nova Poshta API

## Обзор проекта

Создание MCP (Model Context Protocol) сервера для интеграции Nova Poshta API с AI-ассистентами (Claude, GPT и др.). Сервер будет предоставлять инструменты для отслеживания посылок, работы с адресами, создания накладных и доступа к справочникам.

---

## Фаза 1: Инициализация пакета

### 1.1. Создание структуры пакета

```bash
# Создание директории нового пакета
mkdir -p packages/novaposhta-mcp-server
cd packages/novaposhta-mcp-server
```

### 1.2. Инициализация package.json

Создать `package.json` со следующими характеристиками:

```json
{
  "name": "@shopana/novaposhta-mcp-server",
  "version": "0.0.1-alpha.0",
  "description": "MCP Server for Nova Poshta API integration with AI assistants",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "novaposhta-mcp": "./dist/index.js"
  }
}
```

**Ключевые особенности:**
- `"type": "module"` - использование ES modules
- `"bin"` - возможность запуска как CLI утилиты
- Префикс `@shopana/` для консистентности с другими пакетами

### 1.3. Установка зависимостей

```bash
# MCP SDK
yarn add @modelcontextprotocol/sdk

# Nova Poshta клиент (внутренняя зависимость)
yarn add @shopana/novaposhta-api-client@workspace:*

# Транспорт для HTTP запросов
yarn add @shopana/novaposhta-transport-fetch@workspace:*

# Dev dependencies
yarn add -D typescript @types/node tsx
```

---

## Фаза 2: Структура проекта

### 2.1. Файловая структура

```
packages/novaposhta-mcp-server/
├── src/
│   ├── index.ts                 # Точка входа, инициализация MCP сервера
│   ├── server.ts                # Основная логика MCP сервера
│   ├── config.ts                # Конфигурация (API ключ, URL и т.д.)
│   ├── tools/
│   │   ├── index.ts             # Экспорт всех инструментов
│   │   ├── tracking.ts          # Инструменты отслеживания
│   │   ├── address.ts           # Инструменты работы с адресами
│   │   ├── waybill.ts           # Инструменты создания накладных
│   │   ├── reference.ts         # Инструменты справочников
│   │   └── schemas.ts           # JSON схемы для валидации
│   ├── utils/
│   │   ├── error-handler.ts    # Обработка ошибок
│   │   ├── logger.ts            # Логирование
│   │   └── validation.ts        # Валидация входных данных
│   └── types/
│       └── mcp.ts               # Типы специфичные для MCP
├── tests/
│   ├── tools/
│   │   ├── tracking.test.ts
│   │   ├── address.test.ts
│   │   └── waybill.test.ts
│   └── integration/
│       └── server.test.ts
├── examples/
│   ├── claude-desktop-config.json  # Конфиг для Claude Desktop
│   └── usage-examples.ts           # Примеры использования
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

### 2.2. TypeScript конфигурация

Создать `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Фаза 3: Реализация MCP сервера

### 3.1. Конфигурация (config.ts)

```typescript
export interface ServerConfig {
  apiKey: string;
  baseUrl?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  timeout?: number;
}

export function loadConfig(): ServerConfig {
  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    throw new Error('NOVA_POSHTA_API_KEY environment variable is required');
  }

  return {
    apiKey,
    baseUrl: process.env.NOVA_POSHTA_BASE_URL || 'https://api.novaposhta.ua/v2.0/json/',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    timeout: parseInt(process.env.TIMEOUT || '30000'),
  };
}
```

### 3.2. Основной сервер (server.ts)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { createClient } from '@shopana/novaposhta-api-client';
import { createFetchTransport } from '@shopana/novaposhta-transport-fetch';

import { getTrackingTools, handleTrackingTool } from './tools/tracking.js';
import { getAddressTools, handleAddressTool } from './tools/address.js';
import { getWaybillTools, handleWaybillTool } from './tools/waybill.js';
import { getReferenceTools, handleReferenceTool } from './tools/reference.js';

export class NovaPoshtaMCPServer {
  private server: Server;
  private client: any;

  constructor(config: ServerConfig) {
    this.server = new Server(
      {
        name: 'novaposhta-mcp-server',
        version: '0.0.1',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Инициализация Nova Poshta клиента
    const transport = createFetchTransport({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });

    this.client = createClient({
      transport,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // Регистрация доступных инструментов
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        ...getTrackingTools(),
        ...getAddressTools(),
        ...getWaybillTools(),
        ...getReferenceTools(),
      ],
    }));

    // Обработка вызовов инструментов
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Роутинг по категориям инструментов
        if (name.startsWith('track_')) {
          return await handleTrackingTool(name, args, this.client);
        } else if (name.startsWith('address_')) {
          return await handleAddressTool(name, args, this.client);
        } else if (name.startsWith('waybill_')) {
          return await handleWaybillTool(name, args, this.client);
        } else if (name.startsWith('reference_')) {
          return await handleReferenceTool(name, args, this.client);
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Nova Poshta MCP Server running on stdio');
  }
}
```

### 3.3. Точка входа (index.ts)

```typescript
#!/usr/bin/env node
import { NovaPoshtaMCPServer } from './server.js';
import { loadConfig } from './config.js';

async function main() {
  try {
    const config = loadConfig();
    const server = new NovaPoshtaMCPServer(config);
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
```

---

## Фаза 4: Реализация инструментов (Tools)

### 4.1. Инструменты отслеживания (tools/tracking.ts)

**Инструменты:**

1. **track_document** - отслеживание одной посылки
   ```typescript
   {
     name: "track_document",
     description: "Track a single Nova Poshta delivery by tracking number. Returns current status, location, and delivery history.",
     inputSchema: {
       type: "object",
       properties: {
         documentNumber: {
           type: "string",
           description: "Tracking number (e.g., '20400048799000')"
         },
         phone: {
           type: "string",
           description: "Recipient's phone number (optional, for additional verification)",
           optional: true
         }
       },
       required: ["documentNumber"]
     }
   }
   ```

2. **track_multiple_documents** - отслеживание нескольких посылок
3. **get_document_movement** - история перемещения посылки
4. **get_document_list** - список документов по фильтру

**Обработчик:**

```typescript
export async function handleTrackingTool(
  toolName: string,
  args: any,
  client: any
) {
  switch (toolName) {
    case 'track_document': {
      const result = await client.tracking.trackDocument(
        args.documentNumber,
        args.phone
      );

      if (!result) {
        return {
          content: [{
            type: 'text',
            text: 'Document not found or invalid tracking number'
          }]
        };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
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
          }, null, 2)
        }]
      };
    }

    case 'track_multiple_documents': {
      // Реализация для множественного отслеживания
    }

    // ... другие кейсы
  }
}
```

### 4.2. Инструменты адресов (tools/address.ts)

**Инструменты:**

1. **address_search_cities** - поиск городов
   - Входные параметры: `findByString` (название города)
   - Возвращает: список городов с Ref, Area, Region

2. **address_search_settlements** - расширенный поиск населенных пунктов
   - Параметры: `cityName`, `page`, `limit`
   - Возвращает: пагинированный список с полными адресами

3. **address_search_streets** - поиск улиц в населенном пункте
   - Параметры: `settlementRef`, `streetName`, `limit`
   - Возвращает: список улиц с типами (улица, проспект, и т.д.)

4. **address_get_warehouses** - получение списка отделений/поштоматов
   - Параметры: `cityRef`, `warehouseType`, `limit`
   - Возвращает: список отделений с координатами и расписанием

### 4.3. Инструменты накладных (tools/waybill.ts)

**Инструменты:**

1. **waybill_calculate_cost** - расчет стоимости доставки
   - Входные параметры: вес, объем, город отправки/получения, тип доставки
   - Возвращает: стоимость и дату доставки

2. **waybill_create** - создание накладной
   - Параметры: все данные для создания ЭН (отправитель, получатель, груз, и т.д.)
   - Возвращает: номер ЭН, Ref, стоимость

3. **waybill_update** - обновление накладной
4. **waybill_delete** - удаление накладной
5. **waybill_get_delivery_date** - получение даты доставки

### 4.4. Инструменты справочников (tools/reference.ts)

**Инструменты:**

1. **reference_get_cargo_types** - типы грузов
2. **reference_get_service_types** - типы доставки
3. **reference_get_payment_methods** - методы оплаты
4. **reference_get_pallet_types** - типы паллет
5. **reference_get_time_intervals** - временные интервалы доставки
6. **reference_get_ownership_forms** - формы собственности
7. **reference_decode_message** - расшифровка кода ошибки API

---

## Фаза 5: Обработка ошибок и валидация

### 5.1. Обработчик ошибок (utils/error-handler.ts)

```typescript
import { NovaPoshtaError } from '@shopana/novaposhta-api-client';

export function formatError(error: unknown): string {
  if (error instanceof NovaPoshtaError) {
    return `Nova Poshta API Error: ${error.message}\nCode: ${error.code}\nDetails: ${JSON.stringify(error.details)}`;
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Unknown error: ${String(error)}`;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof NovaPoshtaError) {
    return error.code === 'NETWORK_ERROR' ||
           error.code === 'TIMEOUT_ERROR' ||
           error.code === 'RATE_LIMIT_ERROR';
  }
  return false;
}
```

### 5.2. Валидация входных данных

```typescript
export function validateTrackingNumber(number: string): boolean {
  // Формат номера ЭН: 14 цифр (20400048799000)
  return /^\d{14}$/.test(number);
}

export function validatePhoneNumber(phone: string): boolean {
  // Украинский формат: 380XXXXXXXXX
  return /^380\d{9}$/.test(phone);
}

export function validateRef(ref: string): boolean {
  // UUID формат Nova Poshta Ref
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(ref);
}
```

---

## Фаза 6: Тестирование

### 6.1. Unit тесты

Создать тесты для каждого инструмента:

```typescript
// tests/tools/tracking.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleTrackingTool } from '../../src/tools/tracking';

describe('Tracking Tools', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      tracking: {
        trackDocument: vi.fn(),
        trackDocuments: vi.fn(),
      },
    };
  });

  it('should track a document successfully', async () => {
    mockClient.tracking.trackDocument.mockResolvedValue({
      Number: '20400048799000',
      Status: 'Delivered',
      StatusCode: '9',
    });

    const result = await handleTrackingTool(
      'track_document',
      { documentNumber: '20400048799000' },
      mockClient
    );

    expect(result.content[0].text).toContain('Delivered');
  });

  it('should handle invalid tracking number', async () => {
    mockClient.tracking.trackDocument.mockResolvedValue(null);

    const result = await handleTrackingTool(
      'track_document',
      { documentNumber: 'invalid' },
      mockClient
    );

    expect(result.content[0].text).toContain('not found');
  });
});
```

### 6.2. Integration тесты

```typescript
// tests/integration/server.test.ts
describe('MCP Server Integration', () => {
  it('should list all available tools', async () => {
    // Тест ListToolsRequest
  });

  it('should execute tool call successfully', async () => {
    // Тест CallToolRequest
  });
});
```

### 6.3. E2E тесты

Создать тесты с реальным API (используя тестовый ключ):

```bash
# Запуск с реальным API ключом
NOVA_POSHTA_API_KEY=test_key yarn test:e2e
```

---

## Фаза 7: Документация

### 7.1. README.md

Создать подробную документацию:

```markdown
# Nova Poshta MCP Server

MCP сервер для интеграции Nova Poshta API с AI-ассистентами.

## Установка

```bash
yarn add @shopana/novaposhta-mcp-server
```

## Конфигурация

### Claude Desktop

Добавьте в `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "novaposhta": {
      "command": "npx",
      "args": ["@shopana/novaposhta-mcp-server"],
      "env": {
        "NOVA_POSHTA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Доступные инструменты

### Отслеживание (Tracking)
- `track_document` - отслеживание посылки
- `track_multiple_documents` - отслеживание нескольких посылок
- `get_document_movement` - история перемещения

### Адреса (Address)
- `address_search_cities` - поиск городов
- `address_search_settlements` - поиск населенных пунктов
- `address_search_streets` - поиск улиц
- `address_get_warehouses` - получение отделений

### Накладные (Waybill)
- `waybill_calculate_cost` - расчет стоимости
- `waybill_create` - создание ЭН
- `waybill_update` - обновление ЭН
- `waybill_delete` - удаление ЭН

### Справочники (Reference)
- `reference_get_cargo_types` - типы грузов
- `reference_get_service_types` - типы доставки
- и другие...

## Примеры использования

### С Claude Desktop

```
User: Track my package 20400048799000

Claude: [использует track_document]
Ваша посылка в статусе "В пути", находится в г. Киев,
планируемая дата доставки: 20.11.2024
```

### Программное использование

```typescript
import { NovaPoshtaMCPServer } from '@shopana/novaposhta-mcp-server';

const server = new NovaPoshtaMCPServer({
  apiKey: process.env.NOVA_POSHTA_API_KEY!
});

await server.start();
```
```

### 7.2. Примеры конфигурации

Создать файл `examples/claude-desktop-config.json`:

```json
{
  "mcpServers": {
    "novaposhta": {
      "command": "node",
      "args": ["/path/to/packages/novaposhta-mcp-server/dist/index.js"],
      "env": {
        "NOVA_POSHTA_API_KEY": "your_api_key_here",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

## Фаза 8: Сборка и публикация

### 8.1. Скрипты сборки

Добавить в `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "test": "vitest",
    "test:e2e": "vitest run tests/e2e",
    "type-check": "tsc --noEmit",
    "prepublishOnly": "yarn build"
  }
}
```

### 8.2. Публикация

```bash
# Сборка
yarn build

# Проверка типов
yarn type-check

# Запуск тестов
yarn test

# Публикация (если нужно в npm)
yarn publish --access public
```

---

## Фаза 9: Интеграция с монорепо

### 9.1. Обновление корневого package.json

Добавить скрипты для нового пакета:

```json
{
  "scripts": {
    "build:mcp": "yarn workspace @shopana/novaposhta-mcp-server build",
    "dev:mcp": "yarn workspace @shopana/novaposhta-mcp-server dev",
    "test:mcp": "yarn workspace @shopana/novaposhta-mcp-server test"
  }
}
```

### 9.2. Настройка зависимостей между пакетами

Убедиться, что пакет использует workspace-протокол:

```json
{
  "dependencies": {
    "@shopana/novaposhta-api-client": "workspace:*",
    "@shopana/novaposhta-transport-fetch": "workspace:*"
  }
}
```

---

## Фаза 10: Дополнительные возможности (Optional)

### 10.1. Кэширование

Добавить кэширование для справочников:

```typescript
class CacheManager {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttl: number = 3600000) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }
}
```

### 10.2. Rate Limiting

Добавить ограничение частоты запросов:

```typescript
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number = 100;
  private windowMs: number = 60000; // 1 минута

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }
}
```

### 10.3. Метрики и мониторинг

```typescript
class MetricsCollector {
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
  };

  recordRequest(success: boolean, responseTime: number) {
    this.metrics.totalRequests++;
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Расчет среднего времени ответа
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) /
      this.metrics.totalRequests;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}
```

### 10.4. Поддержка Resources

Добавить MCP Resources для документации:

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'novaposhta://docs/api',
      name: 'Nova Poshta API Documentation',
      mimeType: 'text/plain',
    },
    {
      uri: 'novaposhta://docs/tracking',
      name: 'Tracking Guide',
      mimeType: 'text/plain',
    },
  ],
}));
```

---

## Чеклист выполнения

### Обязательные задачи

- [ ] Создать структуру пакета
- [ ] Установить зависимости MCP SDK
- [ ] Реализовать основной сервер с StdioTransport
- [ ] Реализовать инструменты отслеживания (4 инструмента)
- [ ] Реализовать инструменты адресов (4 инструмента)
- [ ] Реализовать инструменты накладных (5 инструментов)
- [ ] Реализовать инструменты справочников (7 инструментов)
- [ ] Добавить обработку ошибок
- [ ] Написать unit тесты для всех инструментов
- [ ] Создать README с документацией
- [ ] Добавить пример конфигурации для Claude Desktop
- [ ] Протестировать интеграцию с Claude Desktop

### Дополнительные задачи (опциональные)

- [ ] Добавить кэширование справочников
- [ ] Реализовать rate limiting
- [ ] Добавить метрики и логирование
- [ ] Создать E2E тесты с реальным API
- [ ] Добавить поддержку MCP Resources
- [ ] Создать CI/CD пайплайн
- [ ] Опубликовать в npm registry

---

## Оценка времени

| Фаза | Время | Приоритет |
|------|-------|-----------|
| Инициализация пакета | 30 мин | Высокий |
| Структура проекта | 30 мин | Высокий |
| Реализация сервера | 2 часа | Высокий |
| Инструменты отслеживания | 2 часа | Высокий |
| Инструменты адресов | 2 часа | Высокий |
| Инструменты накладных | 3 часа | Средний |
| Инструменты справочников | 2 часа | Средний |
| Обработка ошибок | 1 час | Высокий |
| Тестирование | 3 часа | Высокий |
| Документация | 2 часа | Средний |
| Интеграция с Claude | 1 час | Высокий |
| Дополнительные фичи | 4 часа | Низкий |

**Общее время (минимум):** ~15-20 часов для базовой функциональности
**Общее время (с дополнительными фичами):** ~20-25 часов

---

## Ресурсы и ссылки

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Nova Poshta API Documentation](https://devcenter.novaposhta.ua/)
- [Claude Desktop Configuration](https://claude.ai/docs)

---

## Заметки по реализации

### Приоритеты инструментов

1. **Высокий приоритет:**
   - track_document (самый частый use case)
   - address_search_cities
   - address_get_warehouses
   - waybill_calculate_cost

2. **Средний приоритет:**
   - track_multiple_documents
   - address_search_settlements
   - waybill_create
   - reference_get_cargo_types
   - reference_get_service_types

3. **Низкий приоритет:**
   - waybill_update
   - waybill_delete
   - остальные справочники

### Рекомендации по архитектуре

1. **Использовать композицию:** каждый инструмент - отдельная функция
2. **Централизованная обработка ошибок:** все ошибки идут через error-handler
3. **Типобезопасность:** использовать типы из api-client
4. **Логирование:** использовать структурированное логирование (JSON)
5. **Валидация:** проверять входные данные перед отправкой в API

### Безопасность

1. **API ключ:** только через переменные окружения
2. **Валидация входных данных:** защита от injection
3. **Rate limiting:** защита от перегрузки API
4. **Логирование:** не логировать чувствительные данные (API ключи, телефоны)

---

Дата создания: 2024-11-19
Версия: 1.0
Автор: Nova Poshta MCP Team
