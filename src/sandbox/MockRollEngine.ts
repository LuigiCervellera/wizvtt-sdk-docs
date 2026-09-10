import { evaluateRollExpression } from '../sdk/dice';
import type { RollResult } from '../sdk/types';

export interface LoggedRoll {
  id: string;
  timestamp: string;
  expression: string;
  reason: string;
  result: RollResult;
  isPrivate?: boolean;
  rollMode?: string;
  description?: string;
}

export function executeMockRoll(
  expression: string,
  reason: string,
  description?: string,
  options?: {
    isPrivate?: boolean;
    rollMode?: string;
    onRollComplete?: (rollData: RollResult) => void;
  }
): LoggedRoll {
  const result = evaluateRollExpression(expression);

  if (options?.onRollComplete) {
    // Esegui la callback asincrona simulando il round-trip del server
    setTimeout(() => {
      options.onRollComplete?.(result);
    }, 50);
  }

  return {
    id: `roll_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString(),
    expression,
    reason,
    result,
    isPrivate: options?.isPrivate,
    rollMode: options?.rollMode,
    description,
  };
}
