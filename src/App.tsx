import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Flame,
  Gauge,
  Menu,
  Moon,
  Palette,
  PieChart,
  RotateCcw,
  ScatterChart,
  Sun,
  X,
} from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  INITIAL_DOWNTIME_CAUSES,
  INITIAL_OEE_RECORDS,
} from './data/industrialData';
import { COPY } from './data/translations';
import { DowntimeCause, MonthlyOeeRecord, NavView } from './types/analytics';
import { OverviewView } from './components/views/OverviewView';
import { OeeDeepDiveView } from './components/views/OeeDeepDiveView';
import { ConsumosView } from './components/views/ConsumosView';
import { CorrelacaoView } from './components/views/CorrelacaoView';
import { HeatmapView } from './components/views/HeatmapView';
import { ParadasView } from './components/views/ParadasView';
import { ThemeStudioModal } from './components/ThemeStudioModal';

function DashboardShell() {
  const { mode, toggleMode, language, setLanguage, customAccent } = useTheme();
  const t = COPY[language];

  const [activeView, setActiveView] = useState<NavView>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeStudioOpen, setThemeStudioOpen] = useState(false);

  const [oeeRecords, setOeeRecords] = useState<MonthlyOeeRecord[]>(INITIAL_OEE_RECORDS);
  const [downtimeCauses, setDowntimeCauses] = useState<DowntimeCause[]>(INITIAL_DOWNTIME_CAUSES);

  const handleUpdateOeeRecord = (
    id: string,
    field: 'realAvailability' | 'realQuality' | 'realPerformance' | 'realOeeDirect',
    value: number
  ) => {
    setOeeRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleUpdateStops = (id: string, stops: number) => {
    setDowntimeCauses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stops } : c))
    );
  };

  const handleAddCause = (cause: Omit<DowntimeCause, 'id'>) => {
    setDowntimeCauses((prev) => [
      ...prev,
      { ...cause, id: `cause-${Date.now()}` },
    ]);
  };

  const handleRemoveCause = (id: string) => {
    setDowntimeCauses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetAll = () => {
    setOeeRecords(INITIAL_OEE_RECORDS);
    setDowntimeCauses(INITIAL_DOWNTIME_CAUSES);
  };

  const navItems: { id: NavView; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
    { id: 'overview', label: t.nav.overview, icon: Gauge },
    { id: 'oee', label: t.nav.oee, icon: BarChart3 },
    { id: 'consumos', label: t.nav.consumos, icon: Activity },
    { id: 'correlacao', label: t.nav.correlacao, icon: ScatterChart },
    { id: 'heatmap', label: t.nav.heatmap, icon: Flame },
    { id: 'paradas', label: t.nav.paradas, icon: PieChart },
  ];

  const activeNavLabel = navItems.find((n) => n.id === activeView)?.label ?? t.nav.overview;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Desktop Sidebar (256px) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="h-16 px-5 flex items-center border-b border-slate-200 dark:border-slate-800">
          <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            {t.appTitle}
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={active ? { color: customAccent } : undefined}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Language</span>
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  language === 'pt'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                PT
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.actions.resetData}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                {t.appTitle}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
              >
                {language === 'en' ? 'Português' : 'English'}
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700"
              >
                {t.actions.resetData}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header Bar: Contextual breadcrumb on left, primary actions on right */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              <span className="hidden sm:inline">{t.appTitle}</span>
              <span className="hidden sm:inline" aria-hidden="true">/</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {activeNavLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleMode}
              aria-label="Toggle Light/Dark Mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setThemeStudioOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
              style={{ backgroundColor: customAccent }}
            >
              <Palette className="w-3.5 h-3.5" />
              {t.actions.themeStudio}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-[1280px] w-full mx-auto">
          {activeView === 'overview' && (
            <OverviewView
              oeeRecords={oeeRecords}
              onNavigate={(v) => setActiveView(v)}
            />
          )}
          {activeView === 'oee' && (
            <OeeDeepDiveView
              records={oeeRecords}
              onUpdateRecord={handleUpdateOeeRecord}
            />
          )}
          {activeView === 'consumos' && <ConsumosView />}
          {activeView === 'correlacao' && <CorrelacaoView />}
          {activeView === 'heatmap' && <HeatmapView />}
          {activeView === 'paradas' && (
            <ParadasView
              causes={downtimeCauses}
              onUpdateStops={handleUpdateStops}
              onAddCause={handleAddCause}
              onRemoveCause={handleRemoveCause}
            />
          )}
        </main>
      </div>

      <ThemeStudioModal
        open={themeStudioOpen}
        onClose={() => setThemeStudioOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardShell />
    </ThemeProvider>
  );
}
