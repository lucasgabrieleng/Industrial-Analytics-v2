import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, ThemePreset } from '../types/analytics';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'precision-cobalt',
    name: 'Precision Cobalt',
    description: 'Clean engineering light canvas with cobalt telemetry accents.',
    defaultMode: 'light',
    accentPrimary: '#2563eb',
    accentHover: '#1d4ed8',
    chartPalette: ['#2563eb', '#0d9488', '#d97706', '#7c3aed', '#e11d48'],
    streamlitBase: 'light',
  },
  {
    id: 'obsidian-control',
    name: 'Obsidian Control Room',
    description: 'High-contrast dark control surface for continuous plant monitoring.',
    defaultMode: 'dark',
    accentPrimary: '#38bdf8',
    accentHover: '#0284c7',
    chartPalette: ['#38bdf8', '#2dd4bf', '#fbbf24', '#a78bfa', '#fb7185'],
    streamlitBase: 'dark',
  },
  {
    id: 'streamlit-crimson',
    name: 'Crimson Legacy',
    description: 'Inspired by the original .streamlit/config.toml #FF4B4B accent.',
    defaultMode: 'light',
    accentPrimary: '#e11d48',
    accentHover: '#be123c',
    chartPalette: ['#e11d48', '#2563eb', '#059669', '#d97706', '#6366f1'],
    streamlitBase: 'light',
  },
  {
    id: 'emerald-foundry',
    name: 'Emerald Sustainability',
    description: 'Focused on energy efficiency, utility consumption, and yield.',
    defaultMode: 'dark',
    accentPrimary: '#10b981',
    accentHover: '#059669',
    chartPalette: ['#10b981', '#38bdf8', '#f59e0b', '#818cf8', '#f43f5e'],
    streamlitBase: 'dark',
  },
];

interface ThemeContextValue {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
  activePreset: ThemePreset;
  selectPreset: (presetId: string) => void;
  customAccent: string;
  setCustomAccent: (hex: string) => void;
  chartPalette: [string, string, string, string, string];
  setChartPalette: (palette: [string, string, string, string, string]) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  generateStreamlitToml: () => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function darkenHex(hex: string, amount = 24): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [activePreset, setActivePreset] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [customAccent, setCustomAccentState] = useState<string>(THEME_PRESETS[0].accentPrimary);
  const [chartPalette, setChartPalette] = useState<[string, string, string, string, string]>(
    THEME_PRESETS[0].chartPalette
  );
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', customAccent);
    root.style.setProperty('--accent-primary-hover', darkenHex(customAccent, 22));
    root.style.setProperty('--chart-1', chartPalette[0]);
    root.style.setProperty('--chart-2', chartPalette[1]);
    root.style.setProperty('--chart-3', chartPalette[2]);
    root.style.setProperty('--chart-4', chartPalette[3]);
    root.style.setProperty('--chart-5', chartPalette[4]);
  }, [customAccent, chartPalette]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const selectPreset = (presetId: string) => {
    const found = THEME_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePreset(found);
    setMode(found.defaultMode);
    setCustomAccentState(found.accentPrimary);
    setChartPalette(found.chartPalette);
  };

  const setCustomAccent = (hex: string) => {
    setCustomAccentState(hex);
    setChartPalette((prev) => [hex, prev[1], prev[2], prev[3], prev[4]]);
  };

  const generateStreamlitToml = () => {
    const isDark = mode === 'dark';
    return `[theme]
base = "${mode}"
primaryColor = "${customAccent}"
backgroundColor = "${isDark ? '#0B1120' : '#F8FAFC'}"
secondaryBackgroundColor = "${isDark ? '#111827' : '#FFFFFF'}"
textColor = "${isDark ? '#F1F5F9' : '#0F172A'}"
font = "sans serif"`;
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        activePreset,
        selectPreset,
        customAccent,
        setCustomAccent,
        chartPalette,
        setChartPalette,
        language,
        setLanguage,
        generateStreamlitToml,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
