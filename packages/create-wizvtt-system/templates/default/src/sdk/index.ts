export * from "./types";
export * from "./dice";
export * from "./dicePool";
export * from "./theme";
export * from "./components/ui";
export * from "./utils";

export { Ring } from "./components/ring";
export { WanderingEyes } from "./components/wandering-eyes";
export {
  SceneLoadingOverlay,
  type SceneLoadingOverlayProps,
  type SceneLoadingVariant,
} from "./components/SceneLoadingOverlay";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SceneLoadingVariant } from "./components/SceneLoadingOverlay";
import type { GameSystemPlugin } from "./types";

export interface SceneLoadingOptions {
  minDurationMs?: number;
  safetyTimeoutMs?: number;
  variant?: SceneLoadingVariant;
  message?: string;
}

export const SCENE_LOADING_VARIANTS: Array<{
  id: SceneLoadingVariant;
  name: string;
  description: string;
}> = [
  {
    id: "combined",
    name: "Occhi Vaganti + Anello Rotante (Completo)",
    description: "Combina l'anello rotante esterno con le pupille animate al centro per il massimo impatto visivo.",
  },
  {
    id: "eyes",
    name: "Wandering Eyes (Solo Occhi)",
    description: "Animazione con pupille che osservano lo schermo in modo dinamico e fluido.",
  },
  {
    id: "ring",
    name: "Loading Ring (Solo Anello)",
    description: "Cerchio rotante geometrico moderno in stile gaming dark.",
  },
];

export function useSceneLoading(options?: SceneLoadingOptions) {
  const minDurationMs = options?.minDurationMs ?? 5000;
  const safetyTimeoutMs = options?.safetyTimeoutMs ?? 15000;
  const [isLoading, setIsLoading] = useState(false);
  const [sceneName, setSceneName] = useState<string | undefined>();
  const loadStartTimeRef = useRef<number>(0);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLoading = useCallback((name?: string) => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
    }
    loadStartTimeRef.current = Date.now();
    setSceneName(name);
    setIsLoading(true);

    safetyTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      safetyTimerRef.current = null;
    }, safetyTimeoutMs);
  }, [safetyTimeoutMs]);

  const finishLoading = useCallback((name?: string) => {
    if (name !== undefined) {
      setSceneName(name);
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }

    const elapsed = Date.now() - loadStartTimeRef.current;
    const remainingTime = Math.max(0, minDurationMs - elapsed);

    finishTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      finishTimerRef.current = null;
    }, remainingTime);
  }, [minDurationMs]);

  useEffect(() => {
    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  return {
    isLoading,
    sceneName,
    variant: options?.variant || "combined",
    message: options?.message || "Caricamento scena",
    startLoading,
    finishLoading,
  };
}

export function defineGameSystem(plugin: GameSystemPlugin): GameSystemPlugin {
  return plugin;
}

export function exportCharacterToJson(schedaDati: Record<string, any>, systemId: string) {
  const exportData = {
    vtt_version: "1.0",
    system_id: systemId,
    character_name: schedaDati.name || "Personaggio",
    exported_at: new Date().toISOString(),
    scheda_dati: schedaDati,
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement("a");
  const fileName = `${(schedaDati.name || "personaggio").replace(/[^a-z0-9_-]/gi, "_")}_scheda.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseCharacterJson(jsonString: string): Record<string, any> | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === "object") {
      return parsed.scheda_dati || parsed;
    }
    return null;
  } catch {
    return null;
  }
}
