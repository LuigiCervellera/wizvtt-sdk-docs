---
name: wizvtt-system-sdk
description: Guidelines, types, and UI components for building WizVTT tabletop RPG system plugins.
---

# WizVTT System SDK Developer Skill

When building or extending a tabletop RPG system for **WizVTT**, adhere to these guidelines.

## 1. System Definition Structure
Every system must export a default object conforming to SystemDefinition<T>:
- id: Unique lowercase string (e.g. my-system).
- ame: Display name (e.g. My Awesome RPG).
- ersion: Semantic version string.
- uthor: Author name or studio.
- defaultTheme: One of the preset themes or custom theme.
- defaultData: Initial state object for new character sheets.
- SheetComponent: The main React component rendering the character sheet.

## 2. Using SDK UI Components
Always import UI components and theme helpers from @/sdk:
- StatBox: For attributes with optional modifiers and dice rolling buttons.
- RollButton: Standardized clickable dice rolling buttons with tooltips/subtitles.
- Badge: Semantic badges for tags, types, or categories.
- PipTracker: Clickable bubble/box/diamond trackers for health, stamina, spell slots.
- StepperControl: Numeric up/down counters.
- InlineEdit: Editable titles or field values.
- PluginCard, PluginSectionCard: Standard panel wrappers.
- TabContainer: Multi-tab views for organized character sheets.

## 3. Handling Dice Rolls
Use props.onRoll(formula, label, options) to trigger dice rolls and broadcast them in chat.
Or use valuateDicePool(config) from @/sdk for complex dice pool mechanics (successes, triumphs, botches).

## 4. Security & Best Practices
- Do NOT use val(), Function(), or direct DOM injections.
- Do NOT use localStorage or external storage. Use onUpdate to persist state in the room.
- Do NOT perform external network requests (e.g., etch to third-party endpoints).
- Keep file sizes modular and under 350 lines per component.