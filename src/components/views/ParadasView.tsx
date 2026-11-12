import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { COPY } from '../../data/translations';
import { DowntimeCause } from '../../types/analytics';
import { DowntimeDonutChart } from '../charts/AnalyticsCharts';

interface ParadasViewProps {
  causes: DowntimeCause[];
  onUpdateStops: (id: string, stops: number) => void;
  onAddCause: (cause: Omit<DowntimeCause, 'id'>) => void;
  onRemoveCause: (id: string) => void;
}

export function ParadasView({
  causes,
  onUpdateStops,
  onAddCause,
  onRemoveCause,
}: ParadasViewProps) {
  const { language, chartPalette } = useTheme();
  const t = COPY[language].paradasView;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newStops, setNewStops] = useState(8);
  const [newMinutes, setNewMinutes] = useState(30);

  const sortedCauses = useMemo(
    () => [...causes].sort((a, b) => b.stops - a.stops),
    [causes]
  );

  const totalStops = sortedCauses.reduce((s, c) => s + c.stops, 0);
  const totalMinutes = sortedCauses.reduce((s, c) => s + c.stops * c.avgMinutes, 0);
  const topDriver = sortedCauses[0];

  const getCauseName = (c: DowntimeCause) => (language === 'pt' ? c.causePt : c.causeEn);

  const paretoRows = useMemo(() => {
    let cumulative = 0;
    return sortedCauses.map((c, idx) => {
      const share = totalStops > 0 ? (c.stops / totalStops) * 100 : 0;
      cumulative += share;
      return {
        ...c,
        color: chartPalette[idx % chartPalette.length],
        share,
        cumulative,
      };
    });
  }, [sortedCauses, totalStops, chartPalette]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddCause({
      causePt: trimmed,
      causeEn: trimmed,
      category: 'Other',
      stops: Math.max(1, newStops),
      avgMinutes: Math.max(1, newMinutes),
    });
    setNewName('');
    setNewStops(8);
    setNewMinutes(30);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.totalStops}</div>
          <div className="mt-1.5 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {totalStops}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.topCause}</div>
          <div className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
            {topDriver ? getCauseName(topDriver) : '—'}
          </div>
          {topDriver && totalStops > 0 && (
            <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
              {((topDriver.stops / totalStops) * 100).toFixed(1)}% · {topDriver.stops} events
            </div>
          )}
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.estDowntime}</div>
          <div className="mt-1.5 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {(totalMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-500">hrs</span>
          </div>
        </div>
      </div>

      {/* Synchronized Donut + Pareto Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
            {t.donutTitle}
          </h2>
          <DowntimeDonutChart
            slices={paretoRows.map((r) => ({
              id: r.id,
              label: getCauseName(r),
              value: r.stops,
              color: r.color,
            }))}
            activeId={hoveredId}
            onHover={setHoveredId}
            totalLabel={t.totalStops}
          />
          <div className="mt-4 space-y-1.5">
            {paretoRows.map((r) => (
              <div
                key={r.id}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded transition-colors ${
                  hoveredId === r.id ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
                  {getCauseName(r)}
                </span>
                <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                  {r.share.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
              {t.paretoTitle}
            </h2>
            <div className="space-y-4">
              {paretoRows.map((r) => {
                const isActive = hoveredId === r.id;
                const maxStops = Math.max(1, paretoRows[0]?.stops ?? 1);
                return (
                  <div
                    key={r.id}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`p-3 rounded-lg border transition-colors ${
                      isActive
                        ? 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60'
                        : 'border-slate-100 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {getCauseName(r)}
                      </span>
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className="text-slate-600 dark:text-slate-400">
                          {r.stops} {t.stopsCount.toLowerCase()}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {t.cumulative}: <strong>{r.cumulative.toFixed(1)}%</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-200"
                          style={{
                            width: `${(r.stops / maxStops) * 100}%`,
                            backgroundColor: r.color,
                          }}
                        />
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={500}
                        aria-label={`${getCauseName(r)} ${t.stopsCount}`}
                        value={r.stops}
                        onChange={(e) => onUpdateStops(r.id, Math.max(0, Number(e.target.value) || 0))}
                        className="w-16 px-2 py-1 text-right text-xs font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                      />
                      {causes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onRemoveCause(r.id)}
                          aria-label={`Remove ${getCauseName(r)}`}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label htmlFor="new-cause" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.causeName}
              </label>
              <input
                id="new-cause"
                type="text"
                placeholder="e.g. Sensor Calibration"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="w-24">
              <label htmlFor="new-stops" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.stopsCount}
              </label>
              <input
                id="new-stops"
                type="number"
                min={1}
                value={newStops}
                onChange={(e) => setNewStops(Number(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="w-28">
              <label htmlFor="new-min" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.avgMin}
              </label>
              <input
                id="new-min"
                type="number"
                min={1}
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addCause}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
