import React, { useState } from 'react';
import {
  defineGameSystem,
  type CharacterSheetProps,
  type GameSystemPlugin,
  evaluateDicePool,
  createDiceSources,
  TraitChip,
  PipTracker,
  PluginSectionCard,
  clampValue,
} from '@/sdk';
import { Dices } from 'lucide-react';

const HybridPoolSheet: React.FC<CharacterSheetProps> = ({
  schedaDati,
  isOwner,
  isMaster,
  onUpdate,
  onRollDice,
}) => {
  const isEditingDisabled = !isOwner && !isMaster;
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['Esperto in Combattimento']);

  const handleToggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  };

  const handleRollAction = () => {
    // 1. Configura il pool: 1 dado d8 per tratto selezionato + 1 dado d12 maestria
    const traitCount = selectedTraits.length;
    const poolConfig = {
      positiveDice: { d8: Math.max(1, traitCount), d12: 1 },
      negativeDice: { d6: 1 },
      successThreshold: 6,
      triumphValue: 12,
      disasterValue: 1,
    };

    const evalResult = evaluateDicePool(poolConfig);
    const sources = createDiceSources([
      { name: 'Tratti', count: Math.max(1, traitCount), faces: 8, type: 'base' },
      { name: 'Maestria', count: 1, faces: 12, type: 'base' },
      { name: 'Ostacolo', count: 1, faces: 6, type: 'effect' },
    ]);

    onRollDice?.(
      evalResult.formula,
      `Prova d'Azione (${evalResult.outcomeText})`,
      sources,
      evalResult.desc,
      {
        customOutcome: evalResult.outcomeText,
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 text-text-main font-sans">
      <PluginSectionCard title="Tratti Attivi (Pool d8)" variant="sky">
        <div className="flex flex-wrap gap-2">
          {['Esperto in Combattimento', 'Riflessi Fulminei', 'Mente Tattica', 'Volontà di Ferro'].map((t) => (
            <TraitChip
              key={t}
              label={t}
              bonusLabel="+d8"
              isSelected={selectedTraits.includes(t)}
              onToggle={() => handleToggleTrait(t)}
              disabled={isEditingDisabled}
            />
          ))}
        </div>
      </PluginSectionCard>

      <PluginSectionCard title="Risorse & Ferite" variant="rose">
        <PipTracker
          label="Ferite"
          current={schedaDati.wounds ?? 1}
          max={4}
          color="rose"
          shape="diamond"
          criticalThreshold={3}
          onChange={(val) => onUpdate({ ...schedaDati, wounds: clampValue(val, 0, 4) })}
          disabled={isEditingDisabled}
        />
      </PluginSectionCard>

      <button
        type="button"
        onClick={handleRollAction}
        className="w-full py-3 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-xl font-bold border border-border-accent flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
      >
        <Dices className="w-5 h-5" />
        Lancia Prova Pool ({selectedTraits.length} d8 + 1d12 vs 1d6)
      </button>
    </div>
  );
};

export const HybridPoolExamplePlugin: GameSystemPlugin = defineGameSystem({
  id: 'example-hybrid-pool',
  name: 'Esempio: Dice Pool Ibrido',
  description: 'Dimostrazione di sistema basato su pool di dadi positivi e negativi.',
  recommendedTheme: 'abyssal',
  defaultGrid: { unit: 'meters', diagonal: 'euclidean' },
  defaultCharacterData: {
    name: 'Eroe Anime',
    wounds: 1,
  },
  CharacterSheet: HybridPoolSheet,
});
