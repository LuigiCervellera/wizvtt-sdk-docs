import { parseAndRollSingle } from './dice';

export interface DicePoolConfig {
  positiveDice: { [dieFace: string]: number };
  negativeDice?: { [dieFace: string]: number };
  successThreshold?: number;
  triumphValue?: number;
  disasterValue?: number;
}

export interface DicePoolResult {
  positiveResults: Array<{ type: string; val: number }>;
  negativeResults: Array<{ type: string; val: number }>;
  highestPositive: number;
  highestNegative: number;
  successes: number;
  consequences: number;
  triumphs: number;
  disasters: number;
  outcomeText: 'Successo Pieno' | 'Successo con Conseguenze' | 'Fallimento';
  formula: string;
  desc: string;
}

export function evaluateDicePool(config: DicePoolConfig): DicePoolResult {
  const successThreshold = config.successThreshold ?? 6;
  const positiveResults: Array<{ type: string; val: number }> = [];
  const negativeResults: Array<{ type: string; val: number }> = [];
  let triumphs = 0;
  let disasters = 0;

  for (const [die, count] of Object.entries(config.positiveDice || {})) {
    for (let i = 0; i < count; i++) {
      const rolled = parseAndRollSingle(`1${die}`);
      const val = rolled.results[0] ?? rolled.total;
      positiveResults.push({ type: die, val });
      if (config.triumphValue && val === config.triumphValue) triumphs++;
    }
  }

  for (const [die, count] of Object.entries(config.negativeDice || {})) {
    for (let i = 0; i < count; i++) {
      const rolled = parseAndRollSingle(`1${die}`);
      const val = rolled.results[0] ?? rolled.total;
      negativeResults.push({ type: die, val });
      if (config.disasterValue && val === config.disasterValue) disasters++;
    }
  }

  const highestPositive = positiveResults.length > 0
    ? Math.max(...positiveResults.map((d) => d.val))
    : 0;

  const highestNegative = negativeResults.length > 0
    ? Math.max(...negativeResults.map((d) => d.val))
    : 0;

  let successes = 0;
  let consequences = 0;

  if (positiveResults.length > 0) {
    if (highestPositive >= successThreshold) successes++;
    else consequences++;
  }

  if (negativeResults.length > 0) {
    if (highestNegative >= successThreshold) successes++;
    else consequences++;
  }

  let outcomeText: 'Successo Pieno' | 'Successo con Conseguenze' | 'Fallimento';
  if (successes >= 2 || (successes === 1 && negativeResults.length === 0)) {
    outcomeText = 'Successo Pieno';
  } else if (successes === 1) {
    outcomeText = 'Successo con Conseguenze';
  } else {
    outcomeText = 'Fallimento';
  }

  const formulaParts: string[] = [];
  for (const [die, count] of Object.entries(config.positiveDice || {})) {
    if (count > 0) formulaParts.push(`${count}${die}`);
  }
  for (const [die, count] of Object.entries(config.negativeDice || {})) {
    if (count > 0) formulaParts.push(`${count}${die}`);
  }
  const formula = formulaParts.join(' + ') || '1d8';

  const posStr = positiveResults.map((d) => `${d.type}:${d.val}`).join(', ');
  const negStr = negativeResults.map((d) => `${d.type}:${d.val}`).join(', ');

  const desc = `Esito: **${outcomeText}** (${successes} Successi, ${consequences} Conseguenze)${
    triumphs > 0 ? ` 🌟 **${triumphs} TRIONFO!**` : ''
  }${disasters > 0 ? ` ⚠️ **${disasters} DISASTRO!**` : ''}
Dadi Positivi [${posStr || 'Nessuno'}] → Max: ${highestPositive}
Dadi Negativi [${negStr || 'Nessuno'}] → Max: ${highestNegative}`;

  return {
    positiveResults,
    negativeResults,
    highestPositive,
    highestNegative,
    successes,
    consequences,
    triumphs,
    disasters,
    outcomeText,
    formula,
    desc,
  };
}

export function createDiceSources(
  items: Array<{ name: string; count: number; faces: number; type?: 'base' | 'effect' }>
): Array<{ name: string; formula: string; type: 'base' | 'effect' }> {
  return items
    .filter((it) => it.count > 0)
    .map((it) => ({
      name: it.name,
      formula: `${it.count}d${it.faces}`,
      type: it.type || 'base',
    }));
}

export function resetSessionFlags<T extends Record<string, any>>(
  data: T,
  flagKeys: (keyof T)[]
): T {
  const updated = { ...data };
  for (const key of flagKeys) {
    (updated as any)[key] = false;
  }
  return updated;
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
