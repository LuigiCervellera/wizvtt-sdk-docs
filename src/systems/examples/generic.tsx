import React from 'react';
import {
  defineGameSystem,
  type CharacterSheetProps,
  type GameSystemPlugin,
  ResourceBox,
  FieldBox,
} from '@/sdk';

const GenericSheet: React.FC<CharacterSheetProps> = ({
  schedaDati,
  isOwner,
  isMaster,
  onUpdate,
}) => {
  const isEditingDisabled = !isOwner && !isMaster;

  const handleStatChange = (key: string, val: any) => {
    onUpdate({ ...schedaDati, [key]: val });
  };

  return (
    <div className="flex flex-col gap-4 text-text-main font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <FieldBox
            label="Nome Personaggio"
            value={schedaDati.name || ''}
            onChange={(val) => handleStatChange('name', val)}
            disabled={isEditingDisabled}
            placeholder="Nome del personaggio..."
          />
        </div>
        <ResourceBox
          label="Punti Ferita (HP)"
          value={schedaDati.hp || 10}
          onChange={(val) => handleStatChange('hp', Number(val))}
          disabled={isEditingDisabled}
          color="red"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-text-muted">Note e Inventario</label>
        <textarea
          className="w-full bg-surface border border-border-app rounded-xl p-3 text-sm text-text-main h-48 resize-none focus:outline-hidden focus:border-border-accent"
          value={schedaDati.notes || ''}
          onChange={(e) => handleStatChange('notes', e.target.value)}
          disabled={isEditingDisabled}
          placeholder="Appunti liberi, statistiche, abilità e inventario..."
        />
      </div>
    </div>
  );
};

export const GenericExamplePlugin: GameSystemPlugin = defineGameSystem({
  id: 'example-generic',
  name: 'Esempio: Sistema Generico',
  description: 'Scheda universale minimalista per note e tiri liberi.',
  recommendedTheme: 'obsidian',
  defaultGrid: { unit: 'meters', diagonal: 'euclidean' },
  defaultCharacterData: {
    name: 'Avventuriero',
    hp: 10,
    notes: '',
  },
  CharacterSheet: GenericSheet,
});
