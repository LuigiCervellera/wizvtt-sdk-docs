import React from 'react';

export interface GridSettings {
  unit: 'meters' | 'feet';
  diagonal: 'euclidean' | 'dnd5e' | 'alternating';
}

export interface AttackDamageInfo {
  weaponName: string;
  damageFormula: string;
  sources?: Array<{
    name: string;
    formula: string;
    type?: 'base' | 'effect';
  }>;
}

export interface RollSource {
  name: string;
  formula: string;
  type?: 'base' | 'effect' | string;
}

export interface RollResult {
  total: number;
  results?: number[];
  expression?: string;
  reason?: string;
  isCrit?: boolean;
  isFumble?: boolean;
  breakdown?: string;
}

export interface RollOptions {
  isPrivate?: boolean;
  rollMode?: 'normal' | 'advantage' | 'disadvantage' | string;
  attackDamageInfo?: AttackDamageInfo;
  customOutcome?: string;
  hideTotal?: boolean;
  initiativeInfo?: Record<string, unknown>;
  onRollComplete?: (rollData: RollResult) => void;
}

export type RollDiceFunction = (
  expression: string,
  reason: string,
  sources?: Array<{ name: string; formula: string; type?: 'base' | 'effect' | string }>,
  description?: string,
  options?: RollOptions
) => void;

export type TokenSize = 1 | 2 | 3;

export interface TokenSizeConfig {
  size: TokenSize;
  label: string;
  gridSquares: number;
}

export interface FogOfWarSettings {
  enabled: boolean;
  defaultVisionRadius: number;
  defaultAuraRadius?: number;
  defaultAuraColor?: number;
  hideUnrevealedTokens?: boolean;
}

export interface CharacterSheetProps {
  characterId: number | string;
  schedaDati: Record<string, any>;
  isOwner: boolean;
  isMaster: boolean;
  onUpdate: (newData: Record<string, any>) => void;
  onRollDice?: RollDiceFunction;
  onShowAsset?: (url: string, name: string) => void;
}

export type ThemeId =
  | 'arcane'
  | 'crimson'
  | 'emerald'
  | 'abyssal'
  | 'amber'
  | 'dark-amber'
  | 'obsidian';

export interface GameSystemPlugin {
  id: string;
  name: string;
  description: string;
  defaultGrid: GridSettings;
  CharacterSheet: React.FC<CharacterSheetProps>;
  defaultCharacterData?: Record<string, any>;
  sheetWidth?: string;
  defaultFogOfWar?: FogOfWarSettings;
  defaultTokenSize?: TokenSize;
  recommendedTheme?: ThemeId;
}

export type TokenLayer = 'map' | 'objects' | 'gmlayer' | 'foreground';

export interface LayerDefinition {
  id: TokenLayer;
  label: string;
  description: string;
  isMasterOnly: boolean;
}

export interface MapPropConfig {
  id?: string;
  name: string;
  url: string;
  x: number;
  y: number;
  size?: TokenSize;
  rotation?: number;
  layer?: TokenLayer;
  isProp?: boolean;
}
