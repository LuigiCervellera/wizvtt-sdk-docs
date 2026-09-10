import React from 'react';
import { Dices } from 'lucide-react';

export interface FieldBoxProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const FieldBox: React.FC<FieldBoxProps> = ({ label, value, onChange, disabled, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] text-theme-accent font-bold uppercase tracking-widest">{label}</label>
    <input 
      className="bg-surface border border-border-app rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-border-accent transition-all shadow-inner"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export interface ResourceBoxProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  color?: 'white' | 'red';
}

export const ResourceBox: React.FC<ResourceBoxProps> = ({ label, value, onChange, disabled, color = 'white' }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-4 border border-border-app rounded-xl bg-surface/60 shadow-lg">
    <label className="text-[10px] text-theme-accent font-bold uppercase tracking-widest mb-2">{label}</label>
    <input 
      type="number"
      className={`w-20 text-center bg-transparent text-2xl font-black focus:outline-hidden border-b border-border-app focus:border-border-accent transition-colors ${color === 'red' ? 'text-rose-400' : 'text-white'}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

export interface StatBoxProps {
  id?: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  onRollDice?: (expression: string, reason: string) => void;
  disabled?: boolean;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, onChange, onRollDice, disabled }) => {
  const mod = Math.floor((Number(value) - 10) / 2);
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
  return (
    <div className="flex flex-col items-center p-3 border border-border-app rounded-2xl bg-surface shadow-md relative group transition-transform hover:-translate-y-0.5">
      <span className="text-[10px] uppercase font-black tracking-widest text-theme-accent mb-1">{label}</span>
      <input 
        type="number"
        className="w-full text-center bg-transparent text-xl font-black text-white focus:outline-hidden my-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="bg-panel border border-border-accent/40 rounded-full px-3 py-0.5 text-xs font-bold text-theme-accent mt-1 shadow-inner">
        {modStr}
      </div>
      <button 
        className="mt-2 bg-theme-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-theme-primary-hover transition-all cursor-pointer disabled:opacity-50"
        onClick={() => onRollDice?.(`1d20${modStr}`, `Tiro ${label}`)}
        disabled={disabled}
      >
        <Dices className="w-3 h-3" /> Tira
      </button>
    </div>
  );
};

export interface TraitChipProps {
  label: string;
  name?: string;
  type?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onToggle?: () => void;
  variant?: 'vital' | 'identity' | 'curriculum' | 'mecha' | 'accent' | 'warning' | 'default';
  bonusLabel?: string;
  disabled?: boolean;
  title?: string;
  className?: string;
}

export const TraitChip: React.FC<TraitChipProps> = ({
  label,
  type,
  icon,
  isSelected = false,
  onToggle,
  variant = 'default',
  bonusLabel = '+d8',
  disabled = false,
  className = '',
}) => {
  let baseColor = 'border-sky-800/60 bg-sky-950/30 text-sky-200 hover:border-sky-400 hover:bg-sky-900/40';
  let activeColor = 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300 border-sky-300 font-bold';
  let badgeColor = 'bg-sky-950 text-sky-400 border-sky-700/60';

  if (variant === 'vital') {
    baseColor = 'border-rose-800/60 bg-rose-950/30 text-rose-200 hover:border-rose-400 hover:bg-rose-900/40';
    activeColor = 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 border-rose-300 font-bold';
    badgeColor = 'bg-rose-950 text-rose-300 border-rose-700/60';
  } else if (variant === 'identity') {
    baseColor = 'border-indigo-800/60 bg-indigo-950/30 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-900/40';
    activeColor = 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 border-indigo-300 font-bold';
    badgeColor = 'bg-indigo-950 text-indigo-300 border-indigo-700/60';
  } else if (variant === 'curriculum') {
    baseColor = 'border-amber-800/60 bg-amber-950/30 text-amber-200 hover:border-amber-400 hover:bg-amber-900/40';
    activeColor = 'bg-amber-500 text-black shadow-md ring-2 ring-amber-300 border-amber-300 font-black';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-700/60';
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isSelected ? activeColor : baseColor
      } ${className}`}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {icon}
        {type && (
          <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded-md border shrink-0 ${badgeColor}`}>
            {type}
          </span>
        )}
        <span className="font-bold truncate">{label}</span>
      </div>
      <span className={`text-[10px] font-black shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
        {isSelected ? '✓' : bonusLabel}
      </span>
    </button>
  );
};

export interface PipTrackerProps {
  label?: string;
  current: number;
  max: number;
  onChange?: (val: number) => void;
  color?: 'rose' | 'amber' | 'sky' | 'emerald' | 'purple';
  shape?: 'circle' | 'diamond' | 'square';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  criticalThreshold?: number;
  showNumbers?: boolean;
  className?: string;
}

export const PipTracker: React.FC<PipTrackerProps> = ({
  label,
  current,
  max,
  onChange,
  color = 'rose',
  shape = 'circle',
  size = 'md',
  disabled = false,
  criticalThreshold,
  showNumbers = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 text-[9px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-6 h-6 text-xs',
  }[size];

  const colorVariants = {
    rose: {
      filled: 'bg-rose-600 border-rose-400 text-white shadow-rose-900/50',
      empty: 'bg-black/40 border-rose-900/50 hover:border-rose-500 text-zinc-600',
    },
    amber: {
      filled: 'bg-amber-500 border-amber-300 text-black shadow-amber-900/50',
      empty: 'bg-black/40 border-amber-900/50 hover:border-amber-500 text-zinc-600',
    },
    sky: {
      filled: 'bg-sky-500 border-sky-300 text-white shadow-sky-900/50',
      empty: 'bg-black/40 border-sky-900/50 hover:border-sky-500 text-zinc-600',
    },
    emerald: {
      filled: 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-900/50',
      empty: 'bg-black/40 border-emerald-900/50 hover:border-emerald-500 text-zinc-600',
    },
    purple: {
      filled: 'bg-purple-600 border-purple-400 text-white shadow-purple-900/50',
      empty: 'bg-black/40 border-purple-900/50 hover:border-purple-500 text-zinc-600',
    },
  }[color];

  const shapeClasses = {
    circle: 'rounded-full',
    diamond: 'rotate-45 rounded-xs scale-90',
    square: 'rounded-md',
  }[shape];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-zinc-300">{label}</span>
          {showNumbers && (
            <span className="font-mono font-black text-xs text-zinc-400">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: max }, (_, idx) => {
          const isFilled = idx < current;
          const isCritical = criticalThreshold !== undefined && idx >= criticalThreshold;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || !onChange}
              onClick={() => {
                if (!onChange || disabled) return;
                onChange(idx === current - 1 ? idx : idx + 1);
              }}
              className={`border font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed ${sizeClasses} ${shapeClasses} ${
                isFilled ? colorVariants.filled : colorVariants.empty
              } ${isCritical && isFilled ? 'ring-2 ring-rose-400 animate-pulse' : ''}`}
            >
              {shape === 'diamond' ? null : idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export interface StepperControlProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  step?: number;
  unit?: string;
  color?: 'rose' | 'amber' | 'sky' | 'emerald' | 'purple' | 'default';
  className?: string;
}

export const StepperControl: React.FC<StepperControlProps> = ({
  label,
  value,
  min = 0,
  max = 99,
  onChange,
  disabled = false,
  step = 1,
  unit,
  color = 'sky',
  className = '',
}) => {
  const colorText = {
    rose: 'text-rose-300',
    amber: 'text-amber-300',
    sky: 'text-sky-300',
    emerald: 'text-emerald-300',
    purple: 'text-purple-300',
    default: 'text-white',
  }[color];

  return (
    <div className={`flex items-center justify-between p-2 rounded-xl border border-white/10 bg-black/40 ${className}`}>
      {label && <span className="text-xs font-semibold text-zinc-300">{label}</span>}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 flex items-center justify-center font-bold text-white cursor-pointer transition-colors"
        >
          -
        </button>
        <span className={`font-mono font-bold w-7 text-center text-xs sm:text-sm ${colorText}`}>
          {value}
          {unit && <span className="text-[10px] ml-0.5">{unit}</span>}
        </span>
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 flex items-center justify-center font-bold text-white cursor-pointer transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export interface PluginSectionCardProps {
  title: string;
  icon?: React.ReactNode;
  badge?: string | React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'rose' | 'sky' | 'amber' | 'default';
  className?: string;
}

export const PluginSectionCard: React.FC<PluginSectionCardProps> = ({
  title,
  icon,
  badge,
  action,
  children,
  variant = 'default',
  className = '',
}) => {
  const borderBg = {
    rose: 'border-rose-900/50 bg-rose-950/20',
    sky: 'border-sky-900/50 bg-sky-950/20',
    amber: 'border-amber-900/50 bg-amber-950/20',
    default: 'border-border-app/60 bg-surface/70',
  }[variant];

  const titleColor = {
    rose: 'text-rose-400',
    sky: 'text-sky-400',
    amber: 'text-amber-400',
    default: 'text-theme-accent',
  }[variant];

  return (
    <div className={`p-4 rounded-2xl border shadow-lg backdrop-blur-xs flex flex-col gap-3 ${borderBg} ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-xs font-black uppercase tracking-wider ${titleColor}`}>
            {title}
          </span>
          {typeof badge === 'string' ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-zinc-300">
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};
