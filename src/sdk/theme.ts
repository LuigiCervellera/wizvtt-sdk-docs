import type { ThemeId } from './types';
export type { ThemeId };

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'arcane',
    name: 'Arcane',
    subtitle: 'Magia & Mistero',
    primaryColor: '#a855f7',
    accentColor: '#c084fc',
    description: 'Viola arcano profondo, tema predefinito di WizVTT',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    subtitle: 'Sangue & Vampiri',
    primaryColor: '#e11d48',
    accentColor: '#fb7185',
    description: 'Rosso rubino intenso per ambientazioni cupe o vampiriche',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    subtitle: 'Foresta & Druidi',
    primaryColor: '#059669',
    accentColor: '#34d399',
    description: 'Verde smeraldo per avventure nei boschi e natura selvaggia',
  },
  {
    id: 'abyssal',
    name: 'Abyssal',
    subtitle: 'Oceano & Mecha',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    description: 'Blu profondo per anime shonen, robottoni e profondità marine',
  },
  {
    id: 'amber',
    name: 'Amber',
    subtitle: 'Sole & Paladini',
    primaryColor: '#d97706',
    accentColor: '#fbbf24',
    description: 'Ambra dorata per templari, divinità solari e sabbie desertiche',
  },
  {
    id: 'dark-amber',
    name: 'Dark Amber',
    subtitle: 'Fucina & Gotico',
    primaryColor: '#b45309',
    accentColor: '#f59e0b',
    description: 'Ambra brunita su ardesia per Warhammer e ambientazioni cupe',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    subtitle: 'Ombra & Stealth',
    primaryColor: '#64748b',
    accentColor: '#94a3b8',
    description: 'Grigio ardesia minimalista ad altissimo contrasto',
  },
];

export const THEME_CLASSES = {
  bgApp: 'bg-app',
  bgSurface: 'bg-surface',
  bgSurfaceHover: 'bg-surface-hover',
  bgSurfaceActive: 'bg-surface-active',
  bgPanel: 'bg-panel',
  bgPrimary: 'bg-theme-primary',
  bgPrimaryHover: 'bg-theme-primary-hover',
  textPrimary: 'text-theme-primary',
  bgAccent: 'bg-theme-accent',
  textAccent: 'text-theme-accent',
  borderApp: 'border-border-app',
  borderAccent: 'border-border-accent',
  textMain: 'text-text-main',
  textMuted: 'text-text-muted',
  textDim: 'text-text-dim',
} as const;
