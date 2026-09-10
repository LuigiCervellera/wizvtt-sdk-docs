import type { RollOptions, RollResult } from './types';

export interface RollRequestParams {
  formula: string;
  label: string;
  sources?: Array<{ name: string; formula: string; type: 'base' | 'effect' }>;
  description?: string;
  rollMode?: 'normal' | 'advantage' | 'disadvantage';
  rollVisibility?: 'public' | 'private';
  isPrivate?: boolean;
}

const D20_REGEX = /1d20/gi;

export function formatRollParams(params: RollRequestParams) {
  const rollMode = params.rollMode || 'normal';
  const isPrivate = params.isPrivate !== undefined 
    ? params.isPrivate 
    : params.rollVisibility === 'private';

  let finalFormula = params.formula;
  let finalLabel = params.label;

  if (params.formula && params.formula.includes('1d20')) {
    if (rollMode === 'advantage') {
      finalFormula = params.formula.replace(D20_REGEX, '2d20kh1');
      if (!finalLabel.includes('Vantaggio')) {
        finalLabel = `${finalLabel} (Vantaggio)`;
      }
    } else if (rollMode === 'disadvantage') {
      finalFormula = params.formula.replace(D20_REGEX, '2d20kl1');
      if (!finalLabel.includes('Svantaggio')) {
        finalLabel = `${finalLabel} (Svantaggio)`;
      }
    }
  }

  if (isPrivate && !finalLabel.startsWith('[PRIVATO]')) {
    finalLabel = `[PRIVATO] ${finalLabel}`;
  }

  return {
    formula: finalFormula,
    label: finalLabel,
    sources: params.sources,
    description: params.description,
    options: {
      isPrivate,
      rollMode,
    } as RollOptions,
  };
}

export function parseAndRollSingle(dieExpr: string): { total: number; results: number[] } {
  const match = dieExpr.trim().match(/^(\d*)d(\d+)$/i);
  if (!match) {
    const val = parseInt(dieExpr, 10) || 0;
    return { total: val, results: [val] };
  }
  const count = parseInt(match[1] || '1', 10);
  const faces = parseInt(match[2], 10);
  const results: number[] = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * faces) + 1;
    results.push(roll);
    total += roll;
  }
  return { total, results };
}

export function evaluateRollExpression(expr: string): RollResult {
  // Supports basic arithmetic like 1d20+5, 2d6+3, 2d20kh1, 2d20kl1
  const khMatch = expr.match(/^(\d+)d(\d+)kh(\d+)([+-]\d+)?$/i);
  if (khMatch) {
    const count = parseInt(khMatch[1], 10);
    const faces = parseInt(khMatch[2], 10);
    const keep = parseInt(khMatch[3], 10);
    const mod = parseInt(khMatch[4] || '0', 10);
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * faces) + 1);
    const sorted = [...rolls].sort((a, b) => b - a);
    const kept = sorted.slice(0, keep);
    const total = kept.reduce((a, b) => a + b, 0) + mod;
    return {
      total,
      results: rolls,
      expression: expr,
      isCrit: kept.includes(faces),
      isFumble: kept.every(r => r === 1),
      breakdown: `[${rolls.join(', ')}] tieni ${keep} + ${mod} = ${total}`,
    };
  }

  const klMatch = expr.match(/^(\d+)d(\d+)kl(\d+)([+-]\d+)?$/i);
  if (klMatch) {
    const count = parseInt(klMatch[1], 10);
    const faces = parseInt(klMatch[2], 10);
    const keep = parseInt(klMatch[3], 10);
    const mod = parseInt(klMatch[4] || '0', 10);
    const rolls: number[] = [];
    for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * faces) + 1);
    const sorted = [...rolls].sort((a, b) => a - b);
    const kept = sorted.slice(0, keep);
    const total = kept.reduce((a, b) => a + b, 0) + mod;
    return {
      total,
      results: rolls,
      expression: expr,
      isCrit: kept.every(r => r === faces),
      isFumble: kept.includes(1),
      breakdown: `[${rolls.join(', ')}] tieni peggiori ${keep} + ${mod} = ${total}`,
    };
  }

  // Standard dice: NdX + Y
  const regex = /([+-]?\s*\d*d\d+|[+-]?\s*\d+)/gi;
  const matches = expr.replace(/\s+/g, '').match(regex);
  if (!matches) {
    return { total: 0, results: [], expression: expr, breakdown: 'Formula non valida' };
  }

  let total = 0;
  const allRolls: number[] = [];
  const parts: string[] = [];

  for (const part of matches) {
    if (part.includes('d')) {
      const isNegative = part.startsWith('-');
      const clean = part.replace(/^[+-]/, '');
      const rolled = parseAndRollSingle(clean);
      const subTotal = isNegative ? -rolled.total : rolled.total;
      total += subTotal;
      allRolls.push(...rolled.results);
      parts.push(`[${rolled.results.join(', ')}]`);
    } else {
      const val = parseInt(part, 10) || 0;
      total += val;
      parts.push(val >= 0 ? `+${val}` : `${val}`);
    }
  }

  return {
    total,
    results: allRolls,
    expression: expr,
    breakdown: `${parts.join(' ')} = ${total}`,
  };
}
