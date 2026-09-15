import { memo } from "react";
import { WanderingEyes } from "./wandering-eyes";
import { Ring } from "./ring";
import { cn } from "../utils";

export type SceneLoadingVariant = "combined" | "eyes" | "ring";

export interface SceneLoadingOverlayProps {
  isLoading: boolean;
  sceneName?: string;
  className?: string;
  variant?: SceneLoadingVariant;
  customMessage?: string;
  subText?: string;
  showGlow?: boolean;
}

export const SceneLoadingOverlay = memo(function SceneLoadingOverlay({
  isLoading,
  sceneName,
  className,
  variant = "combined",
  customMessage = "Caricamento scena",
  subText,
  showGlow = true,
}: SceneLoadingOverlayProps) {
  return (
    <div
      aria-hidden={!isLoading}
      className={cn(
        "absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-out select-none",
        isLoading
          ? "opacity-100 backdrop-blur-md bg-black/55 pointer-events-auto"
          : "opacity-0 backdrop-blur-none bg-transparent pointer-events-none",
        className
      )}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 shadow-2xl shadow-black/80 backdrop-blur-xl transition-all duration-500",
          isLoading ? "scale-100 translate-y-0" : "scale-95 translate-y-2"
        )}
      >
        {showGlow && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600/20 via-primary/25 to-indigo-600/20 blur-xl opacity-60 pointer-events-none" />
        )}

        <div className="relative flex items-center justify-center w-24 h-24 mb-3">
          {(variant === "combined" || variant === "ring") && (
            <Ring className="w-24 h-24 text-primary/70 animate-spin [--duration:3s]" />
          )}

          {(variant === "combined" || variant === "eyes") && (
            <div className="absolute inset-0 flex items-center justify-center">
              <WanderingEyes className="w-16 h-7 text-primary text-neutral-100" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center mt-1 z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400 animate-pulse">
            {customMessage}
          </span>
          {sceneName && (
            <span className="text-sm font-medium text-neutral-200 mt-1 max-w-[220px] truncate">
              {sceneName}
            </span>
          )}
          {subText && (
            <span className="text-xs text-neutral-400 mt-0.5 max-w-[240px] truncate">
              {subText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
