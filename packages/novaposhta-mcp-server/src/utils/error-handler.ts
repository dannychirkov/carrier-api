import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { NovaPoshtaError } from '@shopana/novaposhta-api-client';

export function formatError(error: unknown): string {
  if (isNovaPoshtaError(error)) {
    const context = error.context ? ` Context: ${JSON.stringify(error.context)}` : '';
    return `Nova Poshta API error (${error.code}): ${error.message}.${context}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : 'Unknown error';
}

/**
 * Safely formats response errors array
 * @param errors - Errors from Nova Poshta response
 * @param fallback - Fallback message if errors is not an array
 * @returns Formatted error message
 */
export function formatResponseErrors(errors: unknown, fallback: string): string {
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join(', ');
  }
  return fallback;
}

export function toErrorResult(error: unknown, prefix = 'Failed to execute tool'): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `${prefix}: ${formatError(error)}`,
      },
    ],
    isError: true,
  };
}

function isNovaPoshtaError(error: unknown): error is NovaPoshtaError {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in (error as Record<string, unknown>) &&
    'message' in (error as Record<string, unknown>),
  );
}
