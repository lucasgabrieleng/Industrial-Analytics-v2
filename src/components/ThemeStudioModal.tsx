import React, { useState } from 'react';
import { Check, Copy, Moon, Sun, X } from 'lucide-react';
import { THEME_PRESETS, useTheme } from '../context/ThemeContext';

interface ThemeStudioModalProps {
  open: boolean;
  onClose: () => void;
}

const ACCENT_SWATCHES = ['#2563eb', '#0d9488', '#e11d48', '#d97706', '#7c3aed', '#10b981'];

export function ThemeStudioModal({ open, onClose }: ThemeStudioModalProps) {
  const {
    mode,
    setMode,
    activePreset,
    selectPreset,
    customAccent,
    setCustomAccent,
    chartPalette,
    generateStreamlitToml,
    language,
  } = useTheme();

  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const tomlOutput = generateStreamlitToml();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tomlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Theme Studio"
    >
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {language === 'pt' ? 'Estúdio de Temas' : 'Custom Theme Studio'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'pt'
                  ? 'Personalize a interface e exporte o config.toml do Streamlit.'
                  : 'Customize live dashboard appearance & export Streamlit config.toml.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Theme Studio"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Surface Mode */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {language === 'pt' ? 'Modo de Superfície' : 'Surface Polarity'}
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setMode('light')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
                  mode === 'light'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
                  mode === 'dark'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Curated Presets */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {language === 'pt' ? 'Temas Predefinidos' : 'Industrial Theme Presets'}
            </div>
            <div className="space-y-2">
              {THEME_PRESETS.map((preset) => {
                const isSelected = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/70'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {preset.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {preset.chartPalette.slice(0, 4).map((hex) => (
                          <span
                            key={hex}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Accent */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {language === 'pt' ? 'Cor de Destaque' : 'Primary Accent Color'}
              </span>
              <span className="text-xs font-mono text-slate-500">{customAccent}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {ACCENT_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setCustomAccent(hex)}
                  aria-label={`Select accent ${hex}`}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    customAccent.toLowerCase() === hex.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-105'
                      : ''
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                aria-label="Custom accent color picker"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Chart Series:</span>
              {chartPalette.map((c, idx) => (
                <span key={`${c}-${idx}`} className="w-4 h-2 rounded-xs" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Streamlit Config Export */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                .streamlit/config.toml
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy TOML'}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed">
              {tomlOutput}
            </pre>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
