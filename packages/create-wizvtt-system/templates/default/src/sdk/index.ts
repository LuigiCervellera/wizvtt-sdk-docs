export * from './types';
export * from './dice';
export * from './dicePool';
export * from './theme';
export * from './components/ui';

import type { GameSystemPlugin } from './types';

export function defineGameSystem(plugin: GameSystemPlugin): GameSystemPlugin {
  return plugin;
}

export function exportCharacterToJson(schedaDati: Record<string, any>, systemId: string) {
  const exportData = {
    vtt_version: '1.0',
    system_id: systemId,
    character_name: schedaDati.name || 'Personaggio',
    exported_at: new Date().toISOString(),
    scheda_dati: schedaDati,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  const fileName = `${(schedaDati.name || 'personaggio').replace(/[^a-z0-9_-]/gi, '_')}_scheda.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseCharacterJson(jsonString: string): Record<string, any> | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object') {
      return parsed.scheda_dati || parsed;
    }
    return null;
  } catch {
    return null;
  }
}
