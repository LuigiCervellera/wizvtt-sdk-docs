# 🎲 WizVTT Game System Starter & Developer Sandbox

[![License: MIT / CC BY-NC-SA 4.0](https://img.shields.io/badge/License-MIT%20%2F%20CC%20BY--NC--SA%204.0-purple.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescript.org/)
[![React 19](https://img.shields.io/badge/React-19.0+-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0+-38bdf8.svg)](https://tailwindcss.com/)
[![WizVTT Platform](https://img.shields.io/badge/WizVTT-Live-a855f7.svg)](https://wizvtt.com)

Benvenuto nello **Starter Kit & Developer Sandbox ufficiale per la community di [WizVTT](https://wizvtt.com)**.

Questo repository standalone fornisce tutti gli strumenti, i tipi TypeScript, i componenti grafici e un **banco di prova locale con Hot Module Replacement (HMR)** per sviluppare, testare e rifinire schede personaggio per qualsiasi gioco di ruolo da tavolo (*Pathfinder, Cyberpunk, Call of Cthulhu, Warhammer, Not the End, Kids on Bikes, Homebrew*, ecc.) in totale autonomia, **senza dover installare o avviare il backend di WizVTT**.

---

## 📑 Indice

1. [⚡ Avvio Rapido](#-avvio-rapido)
2. [📂 Struttura del Progetto](#-struttura-del-progetto)
3. [🤖 Sviluppo Assistito con AI (Cursor & Claude Code)](#-sviluppo-assistito-con-ai-cursor--claude-code)
4. [🛠️ Guida allo Sviluppo di un Sistema](#️-guida-allo-sviluppo-di-un-sistema)
   - [1. Definire il Plugin (`defineGameSystem`)](#1-definire-il-plugin-definegamesystem)
   - [2. Lancio Dadi & Anti-Cheat (`formatRollParams` e `onRollComplete`)](#2-lancio-dadi--anti-cheat-formatrollparams-e-onrollcomplete)
   - [3. Motore di Temi (7 Stili RPG Scuri & Classi Semantiche)](#3-motore-di-temi-7-stili-rpg-scuri--classi-semantiche)
   - [4. UI Kit Primitivo (`TraitChip`, `PipTracker`, `StepperControl`, ecc.)](#4-ui-kit-primitivo-traitchip-piptracker-steppercontrol-ecc)
   - [5. Motore per Pool di Dadi Ibridi (`evaluateDicePool`)](#5-motore-per-pool-di-dadi-ibridi-evaluatedicepool)
   - [6. Proiezione "Mostra a Schermo" (`onShowAsset`)](#6-proiezione-mostra-a-schermo-onshowasset)
   - [7. Import / Export Scheda in JSON](#7-import--export-scheda-in-json)
5. [🧰 Funzionalità della Developer Sandbox](#-funzionalità-della-developer-sandbox)
6. [📤 Come Sottomettere il Tuo Sistema (PR & Revisione)](#-guida-come-sottomettere-il-tuo-sistema-pull-request--revisione)
7. [📄 Licenza & Contributi](#-licenza--contributi)

---

## ⚡ Avvio Rapido

### Prerequisiti
- **Node.js** (v20 o superiore) oppure **Bun** (v1.1 o superiore) o **pnpm / yarn**.

### 1. Inizializzazione rapida del progetto

#### Opzione A: Con il CLI Ufficiale (Consigliato)
```bash
# Con NPM
npm create wizvtt-system mio-sistema-rpg

# Con npx
npx create-wizvtt-system mio-sistema-rpg

# Con Bun
bun create wizvtt-system mio-sistema-rpg
```

#### Opzione B: Con `degit` (direttamente da GitHub)
```bash
# Con npx
npx degit LuigiCervellera/wizvtt-sdk-docs mio-sistema-rpg

# Con Bun
bunx degit LuigiCervellera/wizvtt-sdk-docs mio-sistema-rpg

# Con pnpm
pnpx degit LuigiCervellera/wizvtt-sdk-docs mio-sistema-rpg
```

#### Opzione C: Clonazione Git
```bash
git clone https://github.com/LuigiCervellera/wizvtt-sdk-docs.git mio-sistema-rpg
```

---

### 2. Installazione delle Dipendenze

Entra nella cartella creata ed installa i pacchetti con il tuo gestore preferito:

```bash
cd mio-sistema-rpg

# Usando npm:
npm install

# Usando bun:
bun install

# Usando pnpm:
pnpm install

# Usando yarn:
yarn install
```

---

### 3. Avvia la Developer Sandbox

```bash
# Con npm
npm run dev

# Con bun
bun dev

# Con pnpm
pnpm dev

# Con yarn
yarn dev
```

La Sandbox di sviluppo si aprirà automaticamente su **`http://localhost:3000`** con Hot Module Replacement (HMR).

---

### 4. Test e Verifica del Codice

Prima di aprire una Pull Request per inviare il tuo sistema:
```bash
# Esegui il test di validazione sicurezza e build TypeScript:
npm run check-all
# oppure con bun:
bun run check-all
# oppure con pnpm:
pnpm check-all
```

---

## 📂 Struttura del Progetto

```text
wizvtt-system-starter/
├── package.json              # Dipendenze (Vite 8, React 19, Tailwind v4, Lucide, Sonner)
├── tsconfig.json             # Configurazione TypeScript strict
├── vite.config.ts            # Configurazione Vite con alias @/
├── index.html                # Entry point per la Workbench Sandbox
├── README.md                 # Questo manuale di istruzioni
├── src/
│   ├── sdk/                  # SDK WizVTT Open Source completo
│   │   ├── types.ts          # Definizioni e interfacce TypeScript
│   │   ├── dice.ts           # Helper tiri (formatRollParams, parseAndRollSingle)
│   │   ├── dicePool.ts       # Valutatore pool ibridi (KotR:A, Year Zero, WoD)
│   │   ├── theme.ts          # Definizioni dei 7 Temi RPG e classi semantiche
│   │   ├── components/       # UI Kit (TraitChip, PipTracker, StepperControl, StatBox, ecc.)
│   │   │   └── ui.tsx
│   │   └── index.ts          # Export centralizzato dell'SDK
│   ├── systems/              # Cartella dei sistemi di gioco
│   │   ├── my-system/        # 🚀 IL TUO SISTEMA: Modifica questo file per iniziare!
│   │   │   └── index.tsx
│   │   └── examples/         # Sistemi di riferimento inclusi
│   │       ├── generic.tsx   # Scheda generica minimalista
│   │       └── hybrid-pool.tsx# Scheda per sistema basato su pool di dadi
│   └── sandbox/              # Banco di prova locale interattivo
│       ├── App.tsx           # Layout Workbench (selettore temi, console tiri, ispettore JSON)
│       ├── MockRollEngine.ts # Simulatore client-side di onRollDice
│       ├── index.css         # Stili Tailwind v4 e variabili tema
│       └── main.tsx          # Inizializzazione React
```

---

## 🤖 Sviluppo Assistito con AI (Cursor & Claude Code)

Questo repository include già le istruzioni e i prompt di contesto affinché i moderni assistenti AI di coding (come **Cursor**, **Claude Code**, **Copilot**, ecc.) possano generare schede personaggio perfette, tipizzate e conformi agli standard di WizVTT.

### 🔌 Installazione Rapida in qualsiasi progetto (via CLI)

Se stai creando una scheda in un altro progetto o vuoi caricare la skill nel tuo assistente locale:

**Per Claude Code / Antigravity / Agent CLI:**
```bash
# Scarica la skill direttamente nella cartella delle skill del tuo progetto
mkdir -p .agents/skills/wizvtt-sdk
curl -o .agents/skills/wizvtt-sdk/SKILL.md https://raw.githubusercontent.com/LuigiCervellera/wizvtt-sdk-docs/main/SKILL.md
```

**Per Cursor:**
```bash
# Scarica il file .cursorrules nella radice del tuo workspace
curl -o .cursorrules https://raw.githubusercontent.com/LuigiCervellera/wizvtt-sdk-docs/main/.cursorrules
```

### 💡 Esempio di Prompt da dare all'AI una volta caricata la Skill:
> *"Crea una nuova scheda per il gioco 'Vampiri: La Masquerade' in `src/systems/vtm-v5/index.tsx`. Utilizza il tema 'dark_fantasy', definisci attributi e abilità usando i componenti `PipTracker` dell'SDK e implementa i tiri di dado usando il motore `evaluateDicePool` con successo sui tiri >= 6."*

---

## 🛠️ Guida allo Sviluppo di un Sistema

### 1. Definire il Plugin (`defineGameSystem`)

Ogni sistema di gioco esporta un oggetto conforme all'interfaccia `GameSystemPlugin` creato tramite l'helper `defineGameSystem`.

Modifica **`src/systems/my-system/index.tsx`**:

```tsx
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
    onUpdate({ ...schedaDati, [key]: value });
  };

  const handleRoll = (statName: string, value: number) => {
    const mod = Math.floor((Number(value || 10) - 10) / 2);
    const sign = mod >= 0 ? '+' : '';
    
    // Formatta il tiro tenendo conto di Vantaggio e Riservatezza
    const req = formatRollParams({
      formula: `1d20${sign}${mod}`,
      label: `Tiro ${statName}`,
      rollMode: schedaDati.rollMode, // 'normal' | 'advantage' | 'disadvantage'
      rollVisibility: schedaDati.rollVisibility, // 'public' | 'private'
    });

    onRollDice?.(req.formula, req.label, req.sources, req.description, req.options);
  };

  return (
    <div className="flex flex-col gap-4 text-text-main font-sans">
      <div className="p-4 bg-surface border border-border-app rounded-2xl flex gap-4">
        <FieldBox
          label="Nome Personaggio"
          value={schedaDati.name || ''}
          onChange={(val) => handleStatChange('name', val)}
          disabled={isEditingDisabled}
        />
      </div>

      <PluginSectionCard title="Caratteristiche" variant="default">
        <div className="grid grid-cols-3 gap-3">
          <StatBox
            label="FOR"
            value={schedaDati.str ?? 10}
            disabled={isEditingDisabled}
            onChange={(val) => handleStatChange('str', Number(val))}
            onRollDice={() => handleRoll('Forza', schedaDati.str ?? 10)}
          />
        </div>
      </PluginSectionCard>
    </div>
  );
};

export const MySystemPlugin: GameSystemPlugin = defineGameSystem({
  id: 'my-system',
  name: 'Mio Sistema RPG',
  description: 'Descrizione del sistema personalizzato.',
  recommendedTheme: 'arcane', // 'arcane' | 'crimson' | 'emerald' | 'abyssal' | 'amber' | 'dark-amber' | 'obsidian'
  sheetWidth: 'md:max-w-4xl',
  defaultGrid: {
    unit: 'meters',          // 'meters' | 'feet'
    diagonal: 'euclidean',   // 'euclidean' | 'dnd5e' | 'alternating'
  },
  defaultCharacterData: {
    name: 'Nuovo Eroe',
    str: 14,
    hp: 10,
    hpMax: 10,
  },
  CharacterSheet: MySystemSheet,
});

export default MySystemPlugin;
```

---

### 2. Lancio Dadi & Anti-Cheat (`formatRollParams` e `onRollComplete`)

In WizVTT i dadi vengono calcolati in modo autoritativo sul server per prevenire cheat:

```ts
import { formatRollParams, type RollResult } from '@/sdk';

// 1. Formatta la richiesta
const req = formatRollParams({
  formula: '1d20+4',
  label: 'Tiro per Colpire con Ascia',
  sources: [
    { name: 'Base', formula: '1d20+2', type: 'base' },
    { name: 'Bonus Arma Magica', formula: '+2', type: 'effect' }
  ],
  rollMode: 'advantage',      // Converte automaticamente 1d20 -> 2d20kh1
  rollVisibility: 'private',  // Invia il tiro solo al mittente ed al Master
});

// 2. Invia la richiesta con callback di ritorno
onRollDice?.(req.formula, req.label, req.sources, req.description, {
  ...req.options,
  onRollComplete: (rollData: RollResult) => {
    console.log('Risultato ufficiale:', rollData.total, rollData.results);
    // Aggiorna lo stato della scheda in base all'esito!
  }
});
```

---

### 3. Motore di Temi (7 Stili RPG Scuri & Classi Semantiche)

WizVTT mette a disposizione **7 palette scure RPG**:

| ID Tema | Nome | Atmosfera | Colore Primario |
| :--- | :--- | :--- | :--- |
| `arcane` | **Arcane** | Magia & Mistero (Predefinito) | Viola Arcano (`#a855f7`) |
| `crimson` | **Crimson** | Sangue, Vampiri & Dark Fantasy | Rubino Cremisi (`#e11d48`) |
| `emerald` | **Emerald** | Natura, Foreste & Druidi | Verde Smeraldo (`#059669`) |
| `abyssal` | **Abyssal** | Mecha, Anime Shonen & Oceano | Blu Profondo (`#0284c7`) |
| `amber` | **Amber** | Paladini, Sole & Deserto | Oro / Ambra (`#d97706`) |
| `dark-amber`| **Dark Amber**| Gotico, Fucina & Warhammer | Ambra Brunita (`#b45309`) |
| `obsidian` | **Obsidian** | Ombre, Stealth & Cyberpunk | Grafite / Ardesia (`#64748b`) |

#### Classi CSS Semantiche da utilizzare:
- **Sfondi**: `bg-app` (sfondo base), `bg-surface` (pannelli), `bg-panel` (card interne).
- **Colori Primari**: `bg-theme-primary`, `text-theme-primary`, `bg-theme-primary-hover`.
- **Accenti**: `bg-theme-accent`, `text-theme-accent`.
- **Bordi**: `border-border-app`, `border-border-accent`.
- **Testo**: `text-text-main`, `text-text-muted`, `text-text-dim`.

---

### 4. UI Kit Primitivo (`TraitChip`, `PipTracker`, `StepperControl`, ecc.)

L'SDK esporta componenti React già ottimizzati per sessioni su desktop e tablet:

```tsx
import {
  TraitChip,
  PipTracker,
  StepperControl,
  PluginSectionCard,
  clampValue,
} from '@/sdk';

// 1. Chip Tratti Interattivi (per talenti, abilità, keyword)
<TraitChip
  label="Riflessi Fulminei"
  type="Talento"
  variant="vital" // 'vital' | 'identity' | 'curriculum' | 'default'
  bonusLabel="+d8"
  isSelected={isTraitActive}
  onToggle={() => setIsTraitActive(!isTraitActive)}
/>

// 2. Tracciatore Visivo di Risorse (HP, Ferite, Mana, Punti Azione)
<PipTracker
  label="Punti Ferita"
  current={schedaDati.hp}
  max={schedaDati.hpMax}
  color="rose"     // 'rose' | 'amber' | 'sky' | 'emerald' | 'purple'
  shape="diamond"  // 'circle' | 'diamond' | 'square'
  criticalThreshold={schedaDati.hpMax - 1} // Attiva animazione di allerta se quasi vuoto
  onChange={(val) => onUpdate({ ...schedaDati, hp: clampValue(val, 0, schedaDati.hpMax) })}
/>

// 3. Controlli Numerici Compatti [-] val [+]
<StepperControl
  label="Grado Abilità"
  value={schedaDati.rank}
  min={1}
  max={5}
  onChange={(val) => onUpdate({ ...schedaDati, rank: val })}
/>

// 4. Card Sezione con Glassmorphism
<PluginSectionCard title="Equipaggiamento" variant="sky" badge="3/10 Slot">
  <p className="text-xs">Contenuto della sezione...</p>
</PluginSectionCard>
```

---

### 5. Motore per Pool di Dadi Ibridi (`evaluateDicePool`)

Per giochi come *Knights of the Round: Academy*, *Year Zero Engine*, *Blades in the Dark* o *World of Darkness*:

```ts
import { evaluateDicePool, createDiceSources } from '@/sdk';

const result = evaluateDicePool({
  positiveDice: { d8: 3, d12: 1 }, // 3 dadi tratto (d8) + 1 dado maestria (d12)
  negativeDice: { d6: 2 },         // 2 dadi ostacolo (d6)
  successThreshold: 6,             // Successo con dado >= 6
  triumphValue: 12,                // Trionfo su 12 naturale
  disasterValue: 1,                // Disastro su 1 naturale
});

console.log(result.outcomeText); // "Successo Pieno" | "Successo con Conseguenze" | "Fallimento"
console.log(result.desc);        // Stringa Markdown generata per la chat
```

---

### 6. Proiezione "Mostra a Schermo" (`onShowAsset`)

Consente di portare un'immagine a schermo intero per tutti i partecipanti della stanza:

```tsx
<button onClick={() => onShowAsset?.(schedaDati.url_avatar, schedaDati.name)}>
  Mostra Ritratto a Tutti
</button>
```

---

### 7. Import / Export Scheda in JSON

```ts
import { exportCharacterToJson, parseCharacterJson } from '@/sdk';

// Esporta la scheda come file .json
exportCharacterToJson(schedaDati, 'my-system');

// Carica e valida da stringa JSON
const imported = parseCharacterJson(jsonString);
if (imported) onUpdate(imported);
```

---

## 🧰 Funzionalità della Developer Sandbox

La Sandbox (`npm run dev`) include una suite di strumenti pensata per rendere lo sviluppo rapido e piacevole:

- 🎨 **Selettore Temi Istantaneo**: Testa la tua scheda su tutti i 7 temi RPG con 1 click.
- 🎲 **Console Tiri & Log Real-Time**: Visualizza i dettagli dei dadi lanciati, le formule e gli esiti narrativi.
- 👑 **Simulazione Permessi**: Passa istantaneamente tra le viste *Giocatore (Proprietario)*, *Master (Tutti i permessi)* e *Sola Lettura (Ospite)* per testare la disabilitazione corretta dei campi.
- 💾 **Ispettore JSON Live**: Monitora in diretta l'oggetto `schedaDati` mentre modifichi input e pulsanti.
- 🖼️ **Simulatore Proiezione Schermo**: Testa il comportamento del modal `onShowAsset`.

---

## 📤 Guida: Come Sottomettere il Tuo Sistema (Pull Request & Revisione)

WizVTT accoglie con entusiasmo i sistemi RPG creati dalla community! Per garantire che la piattaforma rimanga stabile, sicura e compatibile per tutti i giocatori, ogni sistema viene sottoposto a un **controllo di sicurezza automatizzato (CI)** e a una **revisione umana da parte dei maintainer di WizVTT**.

```
┌─────────────────────────┐       ┌───────────────────────────────┐       ┌─────────────────────────────┐
│ 🧑‍💻 Tu (Sviluppatore)     │       │ 🤖 CI Automated Check         │       │ 🛡️ Supervisione Umana       │
│                         │       │                               │       │                             │
│ 1. Fork & Sviluppo      │       │ 1. Security & Pattern Audit   │       │ 1. Review codice & layout   │
│ 2. Test in Sandbox      │ ────► │ 2. TypeScript Build (tsc -b)  │ ────► │ 2. Test funzionale          │
│ 3. npm run check-all    │       │ 3. Validazione Contratti SDK  │       │ 3. Merge & Pubblicazione su │
│ 4. Apri Pull Request    │       │    (Esito Superato/Fallito)   │       │    WizVTT                   │
└─────────────────────────┘       └───────────────────────────────┘       └─────────────────────────────┘
```

### 1. Fai il Fork e clona il repository
1. Esegui il fork di questo repository su GitHub: [wizvtt-sdk-docs](https://github.com/LuigiCervellera/wizvtt-sdk-docs).
2. Clona il tuo fork localmente e installa le dipendenze:
   ```bash
   git clone https://github.com/<TUO-USERNAME>/wizvtt-sdk-docs.git
   cd wizvtt-sdk-docs
   npm install
   ```

### 2. Sviluppa la tua Scheda
1. Crea una cartella in `src/systems/<tuo-sistema-id>` (es. `src/systems/dungeon-world`).
2. Puoi prendere come base il file `src/systems/my-system/index.tsx` o uno degli esempi (`generic.tsx`, `hybrid-pool.tsx`).
3. Avvia la sandbox di sviluppo:
   ```bash
   npm run dev
   ```
4. Testa interattività, tiri di dado (`onRoll`), stili nei vari temi (`theme`) e viste (Master, Giocatore, Spettatore).

### 3. Valida il Codice Localmente
Prima di aprire la PR, esegui il controllo automatico di sicurezza e compilazione:
```bash
npm run check-all
```
* **Cosa verifica:**
  - Assenza di codice non sicuro (`eval`, manipolazioni di cookie o storage di sessione, chiamate di rete esterne non autorizzate).
  - Rispetto del contratto TypeScript `SystemDefinition`.
  - Assenza di errori di compilazione/bundle.

### 4. Apri la Pull Request
1. Esegui il commit e fai il push sul tuo repository:
   ```bash
   git checkout -b feature/mio-nuovo-sistema
   git add .
   git commit -m "feat(system): aggiungi supporto per [Nome Sistema]"
   git push origin feature/mio-nuovo-sistema
   ```
2. Apri una Pull Request verso il branch `main` di `wizvtt-sdk-docs`.
3. Compila il **Pull Request Template** che apparirà automaticamente (descrizione del sistema, tipo di dadi, screenshot della scheda in azione).

### 5. Revisione Umana e Approvazione
- Il bot di CI controllerà che il codice compili e rispetti gli standard di sicurezza.
- Un maintainer di WizVTT verificherà l'interfaccia, i metadati e il funzionamento.
- Una volta approvata e mergiata la PR, il sistema verrà inserito nel catalogo ufficiale di WizVTT e reso disponibile per tutti gli utenti!

---

## 📄 Licenza & Contributi

Questo Starter Kit fa parte dell'ecosistema open source di **[WizVTT](https://wizvtt.com)** ed è rilasciato sotto licenza **MIT / CC BY-NC-SA 4.0**.

Sviluppato con ❤️ per la community dei giochi di ruolo da tavolo.
