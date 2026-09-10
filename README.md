# 🎲 WizVTT Game System Starter & Developer Sandbox

Benvenuto nello **Starter Kit ufficiale per sviluppatori e creatori della community** di [WizVTT](https://wizvtt.com).

Questo repository indipendente contiene tutto il necessario per sviluppare, testare e distribuire nuovi sistemi di gioco di ruolo (Pathfinder, Cyberpunk, Call of Cthulhu, Not the End, Homebrew, ecc.) in locale **senza dover installare o configurare il backend di WizVTT**.

---

## ⚡ Quick Start (Avvio Rapido in 1 Minuto)

### 1. Clona e Installa le Dipendenze
```bash
git clone https://github.com/tuo-account/wizvtt-system-starter.git
cd wizvtt-system-starter
npm install
```

### 2. Avvia la Developer Sandbox Locale
```bash
npm run dev
```
La Sandbox di sviluppo si aprirà automaticamente nel tuo browser su `http://localhost:3000`.

---

## 🛠️ Come Creare il Tuo Sistema di Gioco

1. Apri la cartella **`src/systems/my-system/`**.
2. Modifica il file `index.tsx` definendo le statistiche, i tiri e il layout React della tua scheda.
3. Salva: la Sandbox su `http://localhost:3000` si aggiorna all'istante con Hot Module Replacement (HMR).

### Esempio Minimo (`src/systems/my-system/index.tsx`):

```tsx
import React from 'react';
import { defineGameSystem, CharacterSheetProps, formatRollParams, StatBox, FieldBox } from '@/sdk';

const MioSheet: React.FC<CharacterSheetProps> = ({ schedaDati, onUpdate, onRollDice, isOwner, isMaster }) => {
  return (
    <div className="p-4 bg-surface text-text-main rounded-2xl border border-border-app space-y-4">
      <FieldBox
        label="Nome Eroe"
        value={schedaDati.name || ''}
        onChange={(val) => onUpdate({ ...schedaDati, name: val })}
        disabled={!isOwner && !isMaster}
      />

      <StatBox
        label="Forza"
        value={schedaDati.str || 10}
        onChange={(val) => onUpdate({ ...schedaDati, str: Number(val) })}
        onRollDice={(expr, reason) => {
          const req = formatRollParams({ formula: expr, label: reason });
          onRollDice?.(req.formula, req.label, req.sources, req.description, req.options);
        }}
      />
    </div>
  );
};

export const MioSistemaPlugin = defineGameSystem({
  id: 'mio-sistema',
  name: 'Mio Sistema RPG',
  description: 'Un fantastico sistema di gioco personalizzato.',
  recommendedTheme: 'arcane', // 'arcane' | 'crimson' | 'emerald' | 'abyssal' | 'amber' | 'dark-amber' | 'obsidian'
  defaultGrid: { unit: 'meters', diagonal: 'euclidean' },
  defaultCharacterData: { name: 'Nuovo Personaggio', str: 10 },
  CharacterSheet: MioSheet,
});

export default MioSistemaPlugin;
```

---

## 🧰 Funzionalità della Sandbox di Sviluppo

- 🎨 **Selettore dei 7 Temi RPG Scuro**: Verifica all'istante la resa grafica della tua scheda su tutti i temi di WizVTT (Arcane, Crimson, Emerald, Abyssal, Amber, Dark Amber, Obsidian).
- 🎲 **Simulatore Motore Dadi Reale**: Quando la tua scheda chiama `onRollDice`, la Sandbox calcola il tiro con animazione toast, gestisce vantaggio/svantaggio e chiama `onRollComplete`.
- 👑 **Simulazione Ruoli**: Testa come si comporta la scheda dal punto di vista del Giocatore Proprietario, del Game Master o di uno Spettatore in sola lettura.
- 💾 **Ispettore JSON & Import/Export**: Visualizza in tempo reale i dati salvati nella scheda ed esporta/importa file `.json`.

---

## 📤 Come Inviare il tuo Sistema a WizVTT

Quando la tua scheda è pronta:
1. Copia la cartella `src/systems/my-system/` (o fai una Pull Request su GitHub).
2. Il sistema verrà aggiunto a WizVTT e sarà immediatamente disponibile per tutti i giocatori della community!

---

## 📄 Licenza
MIT / CC BY-NC-SA 4.0 Open Source.
