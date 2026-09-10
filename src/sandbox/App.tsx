import { useState, useEffect } from 'react';
import {
  Palette,
  Dices,
  RefreshCw,
  Download,
  Upload,
  User,
  Crown,
  Eye,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { THEME_OPTIONS, type ThemeId } from '../sdk/theme';
import { exportCharacterToJson, parseCharacterJson } from '../sdk/index';
import type { GameSystemPlugin } from '../sdk/types';
import { MySystemPlugin } from '../systems/my-system';
import { GenericExamplePlugin } from '../systems/examples/generic';
import { HybridPoolExamplePlugin } from '../systems/examples/hybrid-pool';
import { executeMockRoll, type LoggedRoll } from './MockRollEngine';
import { Toaster, toast } from 'sonner';

const AVAILABLE_PLUGINS: GameSystemPlugin[] = [
  MySystemPlugin,
  GenericExamplePlugin,
  HybridPoolExamplePlugin,
];

export default function App() {
  const [selectedPluginId, setSelectedPluginId] = useState<string>(MySystemPlugin.id);
  const activePlugin = AVAILABLE_PLUGINS.find((p) => p.id === selectedPluginId) || MySystemPlugin;

  const [activeTheme, setActiveTheme] = useState<ThemeId>(activePlugin.recommendedTheme || 'arcane');
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [isMaster, setIsMaster] = useState<boolean>(false);

  // Character Data State
  const [characterData, setCharacterData] = useState<Record<string, any>>(() => ({
    ...(activePlugin.defaultCharacterData || {}),
  }));

  // Dice Log Console State
  const [rollHistory, setRollHistory] = useState<LoggedRoll[]>([]);

  // Projected Asset State
  const [projectedAsset, setProjectedAsset] = useState<{ url: string; name: string } | null>(null);

  // Sync theme attribute to HTML body
  useEffect(() => {
    document.body.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // When switching plugin, load its default theme and character data
  const handleSelectPlugin = (plugin: GameSystemPlugin) => {
    setSelectedPluginId(plugin.id);
    if (plugin.recommendedTheme) {
      setActiveTheme(plugin.recommendedTheme);
    }
    setCharacterData({ ...(plugin.defaultCharacterData || {}) });
    toast.info(`Sistema cambiato in "${plugin.name}"`);
  };

  const handleRollDice = (
    expression: string,
    reason: string,
    _sources?: any,
    description?: string,
    options?: any
  ) => {
    const roll = executeMockRoll(expression, reason, description, options);
    setRollHistory((prev) => [roll, ...prev.slice(0, 29)]);
    toast.success(`🎲 ${reason}: ${roll.result.total} (${expression})`);
  };

  const handleShowAsset = (url: string, name: string) => {
    setProjectedAsset({ url, name });
    toast.info(`Proiezione Schermo: "${name}"`);
  };

  const handleExportJson = () => {
    exportCharacterToJson(characterData, activePlugin.id);
    toast.success('Scheda esportata in JSON!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCharacterJson(ev.target?.result as string);
      if (parsed) {
        setCharacterData(parsed);
        toast.success('Scheda JSON importata con successo!');
      } else {
        toast.error('File JSON non valido');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-app text-text-main flex flex-col font-sans transition-colors duration-200">
      <Toaster position="bottom-right" richColors />

      {/* TOP WORKBENCH HEADER */}
      <header className="border-b border-border-app bg-surface px-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black uppercase tracking-wider text-white">
                  WizVTT Plugin Workbench
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-theme-primary/20 text-theme-accent border border-border-accent/40 font-bold">
                  Sandbox v1.0
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                Ambiente di sviluppo e collaudo locale per schede personaggio WizVTT
              </p>
            </div>
          </div>

          {/* Plugin Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-theme-accent" /> Sistema:
            </span>
            <select
              value={selectedPluginId}
              onChange={(e) => {
                const found = AVAILABLE_PLUGINS.find((p) => p.id === e.target.value);
                if (found) handleSelectPlugin(found);
              }}
              className="bg-panel border border-border-app rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-hidden focus:border-border-accent cursor-pointer"
            >
              {AVAILABLE_PLUGINS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* WORKBENCH TOOLBAR */}
      <div className="border-b border-border-app bg-panel/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Themes Switcher */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-muted flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-theme-accent" /> Tema:
            </span>
            <div className="flex flex-wrap gap-1">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                    activeTheme === t.id
                      ? 'bg-theme-primary text-white border-border-accent shadow-sm'
                      : 'bg-surface text-text-muted hover:text-white border-border-app'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Role Mode & JSON Tools */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 bg-surface border border-border-app rounded-lg gap-1">
              <button
                type="button"
                onClick={() => { setIsOwner(true); setIsMaster(false); }}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  isOwner && !isMaster ? 'bg-theme-primary text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                <User className="w-3 h-3" /> Giocatore
              </button>
              <button
                type="button"
                onClick={() => { setIsOwner(true); setIsMaster(true); }}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  isMaster ? 'bg-amber-600 text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                <Crown className="w-3 h-3" /> Master
              </button>
              <button
                type="button"
                onClick={() => { setIsOwner(false); setIsMaster(false); }}
                className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  !isOwner && !isMaster ? 'bg-zinc-700 text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" /> Lettura
              </button>
            </div>

            <button
              onClick={handleExportJson}
              className="px-2.5 py-1 bg-surface border border-border-app hover:bg-surface-hover text-text-main rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3 text-theme-accent" /> JSON
            </button>

            <label className="px-2.5 py-1 bg-surface border border-border-app hover:bg-surface-hover text-text-main rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors">
              <Upload className="w-3 h-3 text-theme-accent" /> Carica
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={() => {
                setCharacterData({ ...(activePlugin.defaultCharacterData || {}) });
                toast.info('Scheda ripristinata ai valori di default');
              }}
              className="p-1 rounded-lg bg-surface border border-border-app hover:bg-rose-950 text-text-muted hover:text-rose-400 cursor-pointer transition-colors"
              title="Resetta Scheda"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* LEFT COLUMN: ACTIVE CHARACTER SHEET */}
        <section className={`w-full ${activePlugin.sheetWidth || 'lg:col-span-8'} space-y-4`}>
          <div className="bg-panel border border-border-app rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <activePlugin.CharacterSheet
              characterId="test-character-01"
              schedaDati={characterData}
              isOwner={isOwner}
              isMaster={isMaster}
              onUpdate={setCharacterData}
              onRollDice={handleRollDice}
              onShowAsset={handleShowAsset}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: DICE CONSOLE & STATE INSPECTOR */}
        <aside className="w-full lg:col-span-4 space-y-4">
          {/* Dice Log Console */}
          <div className="bg-panel border border-border-app rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border-app pb-2">
              <div className="flex items-center gap-2">
                <Dices className="w-4 h-4 text-theme-accent" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Console Tiri ({rollHistory.length})
                </h3>
              </div>
              {rollHistory.length > 0 && (
                <button
                  onClick={() => setRollHistory([])}
                  className="text-text-muted hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Pulisci
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {rollHistory.length === 0 ? (
                <div className="text-center py-6 text-text-dim text-xs">
                  Nessun tiro registrato. Clicca sui bottoni di tiro della scheda!
                </div>
              ) : (
                rollHistory.map((roll) => (
                  <div
                    key={roll.id}
                    className="p-2.5 rounded-xl bg-surface border border-border-app text-xs space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span className="font-bold text-theme-accent">{roll.reason}</span>
                      <span className="font-mono">{roll.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-sm">
                        Totale: {roll.result.total}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel border border-border-app text-text-muted">
                        {roll.expression}
                      </span>
                    </div>
                    {roll.result.breakdown && (
                      <div className="text-[10px] text-text-dim font-mono">{roll.result.breakdown}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* JSON State Inspector */}
          <div className="bg-panel border border-border-app rounded-2xl p-4 shadow-xl space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-theme-accent">
              Ispettore Stato JSON (Live)
            </h3>
            <pre className="p-3 bg-app border border-border-app rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-60 custom-scrollbar">
              {JSON.stringify(characterData, null, 2)}
            </pre>
          </div>
        </aside>
      </main>

      {/* MODAL PROIEZIONE SCHERMO */}
      {projectedAsset && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setProjectedAsset(null)}
        >
          <div
            className="bg-panel border border-border-app p-4 rounded-2xl max-w-lg w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-app pb-2">
              <h4 className="text-sm font-bold text-white">{projectedAsset.name}</h4>
              <button
                onClick={() => setProjectedAsset(null)}
                className="text-text-muted hover:text-white text-xs cursor-pointer font-bold"
              >
                ✕ Chiudi
              </button>
            </div>
            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center overflow-hidden border border-border-app">
              <img
                src={projectedAsset.url}
                alt={projectedAsset.name}
                className="max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-[11px] text-text-muted text-center">
              Anteprima proiettata a schermo intero per tutta la stanza.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
