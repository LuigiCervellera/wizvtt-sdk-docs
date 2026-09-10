import React from 'react';
import {
  defineGameSystem,
  type CharacterSheetProps,
  type GameSystemPlugin,
  formatRollParams,
  StatBox,
  FieldBox,
  PipTracker,
  PluginSectionCard,
  clampValue,
} from '@/sdk';

const MySystemSheet: React.FC<CharacterSheetProps> = ({
  schedaDati,
  isOwner,
  isMaster,
  onUpdate,
  onRollDice,
}) => {
  const isEditingDisabled = !isOwner && !isMaster;

  const handleStatChange = (key: string, value: any) => {
    onUpdate({
      ...schedaDati,
      [key]: value,
    });
  };

  const handleRoll = (statName: string, value: number) => {
    const mod = Math.floor((Number(value || 10) - 10) / 2);
    const sign = mod >= 0 ? '+' : '';
    const formula = `1d20${sign}${mod}`;

    const rollReq = formatRollParams({
      formula,
      label: `Tiro ${statName}`,
      rollMode: schedaDati.rollMode,
      rollVisibility: schedaDati.rollVisibility,
    });

    onRollDice?.(
      rollReq.formula,
      rollReq.label,
      rollReq.sources,
      rollReq.description,
      rollReq.options
    );
  };

  return (
    <div className="flex flex-col gap-4 text-text-main font-sans">
      {/* Intestazione */}
      <div className="p-4 bg-surface border border-border-app rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px]">
          <FieldBox
            label="Nome Personaggio"
            value={schedaDati.name || ''}
            onChange={(val) => handleStatChange('name', val)}
            disabled={isEditingDisabled}
            placeholder="Nome dell'eroe..."
          />
        </div>
        <div className="w-32">
          <FieldBox
            label="Classe / Archetipo"
            value={schedaDati.className || ''}
            onChange={(val) => handleStatChange('className', val)}
            disabled={isEditingDisabled}
            placeholder="Guerriero..."
          />
        </div>
      </div>

      {/* Sezione Combattimento & Risorse */}
      <PluginSectionCard title="Risorse Vitali" variant="rose" badge="HP & Mana">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PipTracker
            label="Punti Ferita (HP)"
            current={schedaDati.hp ?? 10}
            max={schedaDati.hpMax ?? 10}
            color="rose"
            disabled={isEditingDisabled}
            onChange={(val) => handleStatChange('hp', clampValue(val, 0, schedaDati.hpMax ?? 10))}
          />
          <PipTracker
            label="Punti Mana / Azione"
            current={schedaDati.mana ?? 5}
            max={schedaDati.manaMax ?? 5}
            color="sky"
            disabled={isEditingDisabled}
            onChange={(val) => handleStatChange('mana', clampValue(val, 0, schedaDati.manaMax ?? 5))}
          />
        </div>
      </PluginSectionCard>

      {/* Caratteristiche */}
      <PluginSectionCard title="Caratteristiche Principali" variant="default">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { id: 'str', label: 'FOR' },
            { id: 'dex', label: 'DES' },
            { id: 'con', label: 'COS' },
            { id: 'int', label: 'INT' },
            { id: 'wis', label: 'SAG' },
            { id: 'cha', label: 'CAR' },
          ].map((stat) => (
            <StatBox
              key={stat.id}
              label={stat.label}
              value={schedaDati[stat.id] ?? 10}
              disabled={isEditingDisabled}
              onChange={(val) => handleStatChange(stat.id, Number(val))}
              onRollDice={() => handleRoll(stat.label, schedaDati[stat.id] ?? 10)}
            />
          ))}
        </div>
      </PluginSectionCard>
    </div>
  );
};

export const MySystemPlugin: GameSystemPlugin = defineGameSystem({
  id: 'my-system',
  name: 'Mio Sistema di Gioco',
  description: 'Un sistema di gioco TTRPG personalizzato creato con WizVTT Plugin SDK.',
  recommendedTheme: 'arcane',
  sheetWidth: 'md:max-w-4xl',
  defaultGrid: {
    unit: 'meters',
    diagonal: 'euclidean',
  },
  defaultCharacterData: {
    name: 'Nuovo Eroe',
    className: 'Avventuriero',
    hp: 10,
    hpMax: 10,
    mana: 5,
    manaMax: 5,
    str: 14,
    dex: 12,
    con: 14,
    int: 10,
    wis: 10,
    cha: 10,
  },
  CharacterSheet: MySystemSheet,
});

export default MySystemPlugin;
