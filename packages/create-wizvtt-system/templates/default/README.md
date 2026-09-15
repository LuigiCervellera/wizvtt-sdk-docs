# WizVTT Open Source Plugin SDK

Benvenuto nell'SDK ufficiale per sviluppatori e creatori della community di **WizVTT**.

Questo SDK fornisce tutte le interfacce, i tipi ed i metodi helper per creare e contribuire con nuovi sistemi di gioco di ruolo (es. *Pathfinder 2e*, *Call of Cthulhu*, *Cyberpunk RED*, *GURPS*, *Homebrew*, ecc.) permettendo loro di integrarsi nativamente con:

- Il motore di rendering del tavolo da gioco (griglie, token, misurazioni).
- Il gateway WebSockets in tempo reale per la chat ed il lancio dei dadi.
- Il supporto nativo a **Vantaggio / Svantaggio** e tiri **Privati per il DM**.
- L'importazione ed esportazione delle schede personaggio in formato JSON portatile.
- Il **motore di Theming a 7 temi oscuri RPG** con classi CSS semantiche.
- La **galleria asset privata per account** (quota 150 MB, estendibile) con upload/eliminazione.
- La proiezione **Mostra a Schermo**: porta un'immagine a schermo intero per tutta la stanza.

---

## Struttura della Cartella Plugins

Per aggiungere un nuovo sistema di gioco al progetto, crea semplicemente una nuova cartella all'interno di `src/plugins/systems/`:

```text
src/plugins/
├── sdk/
│   ├── index.ts          # Metodi ed Helper dell'SDK
│   └── README.md         # Questa guida
├── systems/              # Cartella contenente tutti i sistemi di gioco
│   ├── dnd5e/            # Sistema D&D 5e
│   ├── generic/          # Sistema Generico Minimalista
│   └── pathfinder2e/     # [IL TUO NUOVO SISTEMA]
│       └── index.tsx
├── registry.ts           # Auto-discovery dinamico dei sistemi
├── types.ts              # Interfacce TypeScript
└── index.ts              # Export unico
```

> **Auto-Discovery**: Non devi modificare alcun file di configurazione centrale. Il registro di WizVTT rileva automaticamente qualsiasi modulo esportato in `src/plugins/systems/` grazie al caricamento dinamico di Vite.

---

## 1. Definire un Nuovo Sistema di Gioco (`defineGameSystem`)

Crea il file `src/plugins/systems/mio-sistema/index.tsx` ed usa l'helper `defineGameSystem`:

```tsx
import React from "react";
import {
  defineGameSystem,
  CharacterSheetProps,
  formatRollParams,
} from "@/plugins";

// 1. Componente per la Scheda Personaggio
const MioSistemaSheet: React.FC<CharacterSheetProps> = ({
  schedaDati,
  isOwner,
  isMaster,
  onUpdate,
  onRollDice,
}) => {
  const handleRoll = () => {
    // 2. Prepara i parametri del tiro usando l'SDK
    const rollReq = formatRollParams({
      formula: "1d20+5",
      label: "Tiro per Colpire con Spada",
      rollMode: schedaDati.rollMode, // 'normal' | 'advantage' | 'disadvantage'
      rollVisibility: schedaDati.rollVisibility, // 'public' | 'private'
    });

    // 3. Invia il tiro alla chat ed al server anti-cheat
    onRollDice?.(
      rollReq.formula,
      rollReq.label,
      rollReq.sources,
      rollReq.description,
      rollReq.options,
    );
  };

  return (
    <div className="p-4 bg-surface text-text-main rounded-xl border border-border-app">
      <h2 className="text-xl font-bold text-theme-accent">
        {schedaDati.name || "Nuovo Personaggio"}
      </h2>
      <button
        onClick={handleRoll}
        className="mt-4 px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg font-bold border border-border-accent cursor-pointer"
      >
        Tira Attacco (1d20+5)
      </button>
    </div>
  );
};

// 4. Esporta la configurazione del plugin
export const MioSistemaPlugin = defineGameSystem({
  id: "mio-sistema",
  name: "Mio Sistema di Gioco",
  description: "Un fantastico sistema di gioco personalizzato creato dalla community.",
  recommendedTheme: "arcane", // 'arcane' | 'crimson' | 'emerald' | 'abyssal' | 'amber' | 'dark-amber' | 'obsidian'
  defaultGrid: {
    unit: "meters", // 'meters' | 'feet'
    diagonal: "euclidean", // 'euclidean' | 'dnd5e' | 'alternating'
  },
  CharacterSheet: MioSistemaSheet,
});

export default MioSistemaPlugin;
```

---

## 2. Sistema di Temi & Styling (`useTheme`, `THEME_CLASSES`, `THEME_OPTIONS`)

WizVTT include 7 temi scuri RPG ottimizzati per immersione e leggibilità:

| ID Tema | Nome | Atmosfera RPG | Colore Primario |
| :--- | :--- | :--- | :--- |
| `arcane` | Arcane | Magia & Mistero (Predefinito) | Viola Arcano |
| `crimson` | Crimson | Sangue & Vampiri | Rubino Cremisi |
| `emerald` | Emerald | Foresta & Druidi | Verde Smeraldo |
| `abyssal` | Abyssal | Oceano & Arcano Blu | Blu Cobalto |
| `amber` | Amber | Sole & Paladini | Oro / Ambra |
| `dark-amber` | Dark Amber | Fucina & Resina Oscura | Ambra Bruciata / Carbone |
| `obsidian` | Obsidian | Ombra & Stealth | Grafite / Argento |

### Utilizzo delle Classi CSS Semantiche
Per consentire alla scheda di adattarsi istantaneamente al tema scelto dall'utente:

```tsx
import { THEME_CLASSES } from "@/plugins/sdk";

// Esempio struttura scheda tematica:
<div className="bg-app text-text-main p-6 rounded-2xl border border-border-app">
  <div className="bg-surface border border-border-app p-4 rounded-xl">
    <h3 className="text-theme-accent font-bold">Statistiche</h3>
    <p className="text-text-muted text-xs">Descrizione</p>
  </div>
  
  <button className="bg-theme-primary hover:bg-theme-primary-hover text-white px-4 py-2 rounded-xl font-bold border border-border-accent">
    Azione Principale
  </button>
</div>
```

### Hook React `useTheme`
```tsx
import { useTheme, THEME_OPTIONS } from "@/plugins/sdk";

const ThemeWidget = () => {
  const { theme, setTheme, activeTheme } = useTheme();

  return (
    <div>
      <p>Tema attuale: {activeTheme.name}</p>
      <button onClick={() => setTheme("dark-amber")}>Imposta Dark Amber</button>
    </div>
  );
};
```

---

## 3. Gestione dei Tiri di Dadi (`formatRollParams`)

L'helper `formatRollParams` trasforma automaticamente qualsiasi formula secondo le regole di WizVTT:

```ts
import { formatRollParams } from "@/plugins/sdk";

const req = formatRollParams({
  formula: "1d20+4",
  label: "Tiro Salvezza su Destrezza",
  sources: [
    { name: "Base", formula: "1d20+2", type: "base" },
    { name: "Benedizione", formula: "1d4", type: "effect" },
  ],
  rollMode: "advantage", // Converte 1d20 in 2d20kh1 (tieni il più alto)
  rollVisibility: "private", // Invia il tiro in modo riservato solo al mittente ed al DM
});

onRollDice?.(req.formula, req.label, req.sources, req.description, req.options);
```

### Funzionalità supportate nei tiri:

- **`rollMode: 'advantage'`**: Trasforma automaticamente `1d20` in `2d20kh1` (valuta il d20 migliore).
- **`rollMode: 'disadvantage'`**: Trasforma automaticamente `1d20` in `2d20kl1` (valuta il d20 peggiore).
- **`rollVisibility: 'private'`**: Invia il pacchetto WebSocket **unicamente al giocatore ed al DM**. Gli altri client nella stanza non vedono nulla.

---

## 4. Importazione ed Esportazione Scheda JSON

Per rendere la scheda del tuo sistema salvabile su file locale:

```ts
import { exportCharacterToJson, parseCharacterJson } from "@/plugins/sdk";

// Esporta la scheda in un file JSON portatile
const handleExport = () => {
  exportCharacterToJson(schedaDati, "mio-sistema");
};

// Importa i dati da un file JSON selezionato dall'utente
const handleImport = (jsonText: string) => {
  const importedData = parseCharacterJson(jsonText);
  if (importedData) {
    onUpdate({ ...schedaDati, ...importedData });
  }
};
```

---

## 5. Taglia dei Token e Nebbia di Guerra (`getTokenBounds`, `configureFogOfWar`)

L'SDK fornisce tipi e funzioni helper per configurare la dimensione dei token (1x1 Media o 2x2 Grande) e le impostazioni della Nebbia di Guerra (Fog of War):

```ts
import { getTokenBounds, configureFogOfWar } from "@/plugins/sdk";

// 1. Calcola i limiti fisici ed il raggio del token (1 = 1x1 Media, 2 = 2x2 Grande, 3 = 3x3 Enorme)
const bounds = getTokenBounds(3, 60); 
// returns { effectiveSize: 180, radius: 86, gridSquares: 9, label: 'Enorme (3x3)' }

// 2. Configura le impostazioni per la Nebbia di Guerra ed il raggio visivo
const fogConfig = configureFogOfWar({
  enabled: true,
  visionRadiusFeet: 60,
  auraRadiusFeet: 15,
  auraColor: 0xa855f7
});
```

---

## 6. Componenti UI Primitivi (`FieldBox`, `StatBox`, `SkillRow`, `ModernStatBox`)

L'SDK esporta componenti UI già stilizzati con il design system scuro e coerente con i temi di WizVTT:

```tsx
import { 
  StatBox, 
  SkillRow, 
  FieldBox, 
  ResourceBox, 
  ModernStatBox,
  calculateModifier,
  formatModifier 
} from "@/plugins/sdk";

// Calcolo modificatori D&D / Pathfinder
const mod = calculateModifier(16); // returns +3
const modStr = formatModifier(mod); // returns "+3"

// Uso dei componenti nelle schede
<StatBox 
  id="str" 
  label="Forza" 
  value={schedaDati.str} 
  onChange={(val) => onUpdate({ ...schedaDati, str: val })} 
  onRollDice={onRollDice} 
/>

<SkillRow 
  label="Atletica" 
  statName="STR" 
  isProficient={schedaDati.atleticaProf} 
  statModifier={mod} 
  proficiencyBonus={2} 
  onProficiencyChange={(checked) => onUpdate({ ...schedaDati, atleticaProf: checked })} 
  onRollDice={onRollDice} 
/>
```

---

## 7. Galleria Asset & Quota (`useAssetGallery`, `formatStorageBytes`, `getFullAssetUrl`)

Ogni account ha una **galleria privata** di asset (mostri, NPC, mappe, note, altri) con una **quota totale di 150 MB** per account.

```tsx
import { useAssetGallery, formatStorageBytes, getFullAssetUrl } from "@/plugins/sdk";

const MyGalleryWidget = () => {
  const { assets, storage, isLoading, upload, removeAsset } = useAssetGallery();

  const pct = storage ? Math.round((storage.used_bytes / storage.limit_bytes) * 100) : 0;

  return (
    <div>
      <p>{formatStorageBytes(storage?.used_bytes ?? 0)} / {formatStorageBytes(storage?.limit_bytes ?? 0)} ({pct}%)</p>

      <input type="file" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) await upload(file, "Ritratto");
      }} />

      <ul>
        {assets.monsters.map((a) => (
          <li key={a.id}>
            <img src={getFullAssetUrl(a.url)} alt={a.nome} />
            <button onClick={() => removeAsset(a.id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 8. Mostra a Schermo (`onShowAsset`)

Qualsiasi membro della stanza (Master e Giocatori) può proiettare un'immagine a schermo intero per tutti i presenti.

```tsx
import type { CharacterSheetProps } from "@/plugins";

const Sheet: React.FC<CharacterSheetProps> = ({ schedaDati, onShowAsset }) => (
  <button onClick={() => onShowAsset?.(schedaDati.url_avatar, schedaDati.name)}>
    Mostra Ritratto a Tutti
  </button>
);
```

---

## 9. Engine Audio, Suoni Ambientali & Playlist (`useAudioService`, `usePlaylists`)

L'SDK mette a disposizione un **doppio canale audio autonomo** (Musica Jukebox e Suoni Ambientali) più un canale istantaneo per Effetti Sonori (SFX) ed il sistema di gestione Playlist.

```tsx
import { 
  useAudioService, 
  playMusicTrack, 
  playAmbientTrack, 
  playSfxEffect, 
  stopAllAudio 
} from "@/plugins/sdk";

const BossBattleControl: React.FC = () => {
  const audio = useAudioService();

  const handleBossEncounter = () => {
    playMusicTrack("/uploads/boss_theme.mp3", "Scontro Finale con il Drago", true);
    playAmbientTrack("/uploads/heavy_thunder.mp3", "Tempesta e Tuoni", true);
    playSfxEffect("/uploads/dragon_roar.mp3", "Ruggito del Drago");
  };

  return (
    <div className="p-3 bg-surface border border-border-app rounded-lg space-y-2">
      <h4 className="text-xs font-bold text-theme-accent">Controlli Audio Scontro</h4>
      
      <p className="text-[11px] text-text-muted">
        Musica: {audio.currentTrack?.title || "Nessuna"} | Ambiente: {audio.ambientTrack?.title || "Nessuno"}
      </p>

      <div className="flex gap-2">
        <button 
          onClick={handleBossEncounter}
          className="px-3 py-1.5 bg-theme-primary hover:bg-theme-primary-hover text-white rounded text-xs font-medium"
        >
          Avvia Scontro Boss
        </button>

        <button 
          onClick={stopAllAudio}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium"
        >
          Ferma Tutto L'Audio
        </button>
      </div>
    </div>
  );
};
```

---

## 10. Modifica Mappa, Elementi Scenografici (Props) e Livello Master (GM Layer)

L'SDK include helper pronti all'uso per gestire elementi scenografici, oggetti decorativi della mappa e token segreti posizionati sui livelli Master:

```tsx
import { createMapProp, createGmSecretToken, getAvailableLayers, formatLayerName } from "@/plugins";

// Crea un elemento d'arredo o ostacolo scenografico posizionato sotto i token
const propChest = createMapProp({
  name: "Baule del Tesoro",
  url: "/uploads/chest_prop.png",
  x: 600,
  y: 450,
  size: 1, // 1x1 quadrato
  rotation: 0,
  layer: "map", // 'map' (default per props) o 'foreground'
});

// Token o trappola invisibile ai giocatori, visibile con opacità solo al Master
const secretTrap = createGmSecretToken({
  name: "Trappola a Fossa Trabocchetto",
  url: "/uploads/pit_trap.png",
  x: 900,
  y: 600,
  size: 2, // 2x2 quadrati
});

// Elenco livelli accessibili in base al ruolo dell'utente
const accessibleLayers = getAvailableLayers(isMaster);
console.log(formatLayerName("gmlayer")); // "Livello Master (Invisibile ai Giocatori)"
```

## 11. UI Primitives per Schede & Tratti (`TraitChip`, `PipTracker`, `StepperControl`, `PluginSectionCard`)

L'SDK mette a disposizione un set completo di componenti React per realizzare schede grafiche e pannelli di controllo tematici:

- **`TraitChip`**: Badge/chip selezionabile per tratti, keyword, talenti e abilità con stato attivo, varianti cromatiche (`vital`, `identity`, `curriculum`, `mecha`, `warning`, `default`), tooltip e badge formula (es. `+d8`).
- **`PipTracker`**: Tracciatore visivo di ferite, punti limite, stamina, punti mana o cariche (con forme `circle`, `diamond`, `square` e soglia di criticità con animazione pulse).
- **`StepperControl`**: Controlli numerici compatti `[-] valore [+]` con limiti min/max e step configurabile.
- **`PluginSectionCard`**: Contenitori per le sezioni della scheda con bordo, sfondo in vetro (glassmorphism) ed header semantico con icona e badge.
- **`CompendiumDataList`**: Datalist riutilizzabile per suggerimenti di autocompletamento (archetipi, incantesimi, stirpi).

```tsx
import {
  TraitChip,
  PipTracker,
  StepperControl,
  PluginSectionCard,
} from "@/plugins/sdk";

const PilotStatusCard: React.FC = () => (
  <PluginSectionCard
    title="Tratti Vitali & Ferite"
    variant="rose"
    badge="3 HP Max"
  >
    <TraitChip
      label="Pilota Provetto"
      type="Anima"
      variant="vital"
      isSelected={true}
      bonusLabel="+d8"
      onToggle={() => console.log("Toggled")}
    />

    <PipTracker
      label="Punti Ferita"
      current={1}
      max={3}
      color="rose"
      criticalThreshold={2}
      onChange={(hp) => console.log("New HP:", hp)}
    />
  </PluginSectionCard>
);
```

---

## 12. Engine Dice Pool & Risoluzione Multi-Dado (`evaluateDicePool`, `createDiceSources`, `resetSessionFlags`, `clampValue`)

Per giochi basati su pool di dadi ibridi (KotR:A, Year Zero Engine, Blades in the Dark, World of Darkness):

- **`evaluateDicePool`**: Calcola automaticamente i successi (soglia configurabile, default `>= 6`), conseguenze, dadi massimi positivi e negativi, trionfi (`12` su d12) e disastri (`1` naturale su d6/d4), generando la formula e la descrizione formattata per la chat.
- **`createDiceSources`**: Genera un array tipizzato e validato di fonti di dadi per `onRollDice` evitando errori di parsing o formule vuote.
- **`resetSessionFlags`**: Utility per resettare flag booleani per sessione (es. reroll usati, cariche giornaliere).
- **`clampValue`**: Limita un valore numerico tra un minimo e un massimo (inclusi), utile per tracciatori ferite, mana, livelli romance o stamina.

```tsx
import { evaluateDicePool, createDiceSources, resetSessionFlags, clampValue } from "@/plugins/sdk";

// Valutazione automatica del pool
const result = evaluateDicePool({
  positiveDice: { d8: 3, d12: 1 },
  negativeDice: { d6: 2, d4: 1 },
  successThreshold: 6,
  triumphValue: 12,
  disasterValue: 1,
});

console.log(result.outcomeText); // "Successo Pieno" | "Successo con Conseguenze" | "Fallimento"
console.log(result.successes, result.consequences);

// Creazione fonti per onRollDice
const sources = createDiceSources([
  { name: "Tratti", count: 3, faces: 8, type: "base" },
  { name: "Knight", count: 1, faces: 12, type: "base" },
  { name: "Difficoltà", count: 2, faces: 6, type: "effect" },
]);
```

---

## 13. Motore di Lancio Dadi Unificato & Callback Reattivo (`onRollComplete`)

In WizVTT è presente un **motore di lancio dadi unico e centralizzato**:

1. **Architettura Anti-Cheat**: Nelle sessioni multiplayer il server calcola il risultato reale e autoritativo dei dadi.
2. **Unico Punto di Richiesta (`onRollDice`)**: Nessun componente o plugin deve generare numeri casuali isolati. Ogni azione richiede il tiro a `onRollDice`.
3. **Ricezione Reattiva del Risultato (`onRollComplete`)**: Se il tuo plugin deve aggiornare lo stato del personaggio in base all'esito del tiro (es. tiri contro morte, riposo breve, calcolo Livelli di Successo, mana speso), basta specificare `onRollComplete` nelle opzioni:

```tsx
import type { CharacterSheetProps, RollResult } from "@/plugins";

const MyCustomSheet: React.FC<CharacterSheetProps> = ({ schedaDati, onUpdate, onRollDice }) => {
  const handleDeathSave = () => {
    onRollDice?.(
      "1d20",
      "Tiro Salvezza Contro la Morte (CD 10)",
      undefined,
      "CD 10: con 10 o più è un Successo (Nat 20: 1 PF), con 9 o meno è un Fallimento.",
      {
        onRollComplete: (rollData: RollResult) => {
          // rollData.total contiene il valore autorevole e sincronizzato calcolato dal motore!
          const roll = rollData.results?.[0] ?? rollData.total;
          if (roll === 20) {
            onUpdate({ ...schedaDati, hp: 1 });
          } else if (roll >= 10) {
            onUpdate({ ...schedaDati, deathSuccesses: (schedaDati.deathSuccesses || 0) + 1 });
          } else {
            onUpdate({ ...schedaDati, deathFailures: (schedaDati.deathFailures || 0) + (roll === 1 ? 2 : 1) });
          }
        }
      }
    );
  };

  return (
    <button onClick={handleDeathSave}>Tira Salvezza Morte</button>
  );
};
```

---

## 14. Caricamento Scena & UI Loaders SDK (`useSceneLoading`, `SceneLoadingOverlay`)

L'SDK include strumenti e componenti grafici pronti all'uso per gestire le schermate di transizione, i caricamenti asincroni pesanti (download mappe, texture token, rendering muri/nebbia) e gli indicatori di attesa in stile dark gaming.

### Componenti di Caricamento Disponibili

1. **`Ring` (`@/components/ring`)**: Anello di caricamento moderno animato con rotazione continua e proprietà customizzabili via Tailwind.
2. **`WanderingEyes` (`@/components/wandering-eyes`)**: Occhi animati con pupille mobili che osservano lo schermo in modo fluido.
3. **`SceneLoadingOverlay` (`@/plugins/sdk`)**: Overlay a schermo intero o relativo con sfocatura dinamica (`backdrop-blur-md`), card glassmorphism dark, effetto glow viola/indigo e supporto alle varianti visive.

### Varianti Supportate (`variant`)

- `'combined'` *(default)*: Mostra `WanderingEyes` al centro racchiuso dall'anello rotante `Ring`.
- `'eyes'`: Mostra esclusivamente le pupille animate di `WanderingEyes`.
- `'ring'`: Mostra esclusivamente il cerchio rotante di `Ring`.

### Esempio d'Uso: Overlay con `useSceneLoading`

```tsx
import React from 'react';
import { 
  SceneLoadingOverlay, 
  useSceneLoading, 
  Ring, 
  WanderingEyes 
} from '@/plugins/sdk';

export const CustomMapLoader: React.FC = () => {
  const { isLoading, sceneName, startLoading, finishLoading } = useSceneLoading({
    minDurationMs: 5000, // Estensione di sicurezza 5 secondi
    safetyTimeoutMs: 15000,
  });

  const handleSwitchDungeon = async () => {
    startLoading("Catacombe Oscure - Livello 3");
    await fetchMapAssets();
    finishLoading();
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-xl bg-neutral-950">
      {/* Overlay di Caricamento con Sfocatura */}
      <SceneLoadingOverlay 
        isLoading={isLoading} 
        sceneName={sceneName} 
        variant="combined" 
        customMessage="Caricamento Scena & Asset"
      />

      <div className={`p-6 transition-all duration-500 ${isLoading ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
        <h2 className="text-xl font-bold text-white">Area di Gioco</h2>
        <button 
          onClick={handleSwitchDungeon}
          className="mt-4 px-4 py-2 bg-primary rounded-lg text-white font-medium"
        >
          Carica Livello 3
        </button>
      </div>
    </div>
  );
};
```

---

## Licenza Open Source

Questo SDK fa parte del progetto open source WizVTT. Sei libero di creare, condividere e distribuire plugin di gioco per la community!

