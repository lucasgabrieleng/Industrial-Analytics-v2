import React, { useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CONSUMPTION_RECORDS } from '../../data/industrialData';
import { COPY } from '../../data/translations';
import { ConsumptionLineChart, LineSeries } from '../charts/AnalyticsCharts';

const PLANTS = ['Planta A', 'Planta B', 'Planta C'] as const;
const INPUTS = ['Insumo 1', 'Insumo 2', 'Insumo 3'] as const;
const MONTHS = Array.from(new Set(CONSUMPTION_RECORDS.map((r) => r.date)));

export function ConsumosView() {
  const { language, chartPalette } = useTheme();
  const t = COPY[language].consumosView;

  const [selectedPlant, setSelectedPlant] = useState<'Planta A' | 'Planta B' | 'Planta C'>('Planta A');
  const [selectedInput, setSelectedInput] = useState<'Insumo 1' | 'Insumo 2' | 'Insumo 3'>('Insumo 1');
  const [compareAllPlants, setCompareAllPlants] = useState(false);
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(MONTHS.length - 1);

  const safeStart = Math.min(startIdx, endIdx);
  const safeEnd = Math.max(startIdx, endIdx);
  const activeDates = MONTHS.slice(safeStart, safeEnd + 1);

  const activeRecords = useMemo(() => {
    return CONSUMPTION_RECORDS.filter(
      (r) =>
        r.input === selectedInput &&
        activeDates.includes(r.date) &&
        (compareAllPlants || r.plant === selectedPlant)
    );
  }, [selectedPlant, selectedInput, compareAllPlants, activeDates]);

  const unit = activeRecords[0]?.unit ?? 'units';

  const series: LineSeries[] = useMemo(() => {
    const targetPlants = compareAllPlants ? [...PLANTS] : [selectedPlant];
    return targetPlants.map((plant, idx) => ({
      name: plant,
      color: chartPalette[idx % chartPalette.length],
      points: CONSUMPTION_RECORDS.filter(
        (r) => r.plant === plant && r.input === selectedInput && activeDates.includes(r.date)
      ).map((r) => ({ label: r.label, value: r.consumption })),
    }));
  }, [compareAllPlants, selectedPlant, selectedInput, activeDates, chartPalette]);

  const primarySeries = series[0]?.points ?? [];
  const avgVal = primarySeries.length
    ? primarySeries.reduce((s, p) => s + p.value, 0) / primarySeries.length
    : 0;
  const peakVal = primarySeries.length ? Math.max(...primarySeries.map((p) => p.value)) : 0;
  const minVal = primarySeries.length ? Math.min(...primarySeries.map((p) => p.value)) : 0;
  const deltaPct =
    primarySeries.length >= 2 && primarySeries[0].value > 0
      ? ((primarySeries[primarySeries.length - 1].value - primarySeries[0].value) /
          primarySeries[0].value) *
        100
      : 0;

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

      {/* Filter Toolbar */}
      <section className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t.selectPlant}
          </label>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {PLANTS.map((p) => (
              <button
                key={p}
                type="button"
                disabled={compareAllPlants}
                onClick={() => setSelectedPlant(p)}
                className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  compareAllPlants
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : selectedPlant === p
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t.selectInput}
          </label>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {INPUTS.map((inp) => (
              <button
                key={inp}
                type="button"
                onClick={() => setSelectedInput(inp)}
                className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedInput === inp
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {inp}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t.dateRange}
          </label>
          <div className="flex items-center gap-2">
            <select
              aria-label={t.from}
              value={safeStart}
              onChange={(e) => setStartIdx(Number(e.target.value))}
              className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx} disabled={idx > safeEnd}>
                  {m}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-400">-</span>
            <select
              aria-label={t.to}
              value={safeEnd}
              onChange={(e) => setEndIdx(Number(e.target.value))}
              className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx} disabled={idx < safeStart}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setCompareAllPlants((v) => !v)}
            className={`w-full lg:w-auto px-4 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              compareAllPlants
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.comparePlants}
          </button>
        </div>
      </section>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.avgConsumption}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {avgVal.toFixed(1)} <span className="text-xs font-normal text-slate-500">{unit}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.peakConsumption}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {peakVal} <span className="text-xs font-normal text-slate-500">{unit}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.minConsumption}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
            {minVal} <span className="text-xs font-normal text-slate-500">{unit}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.periodDelta}</div>
          <div
            className={`mt-1.5 text-2xl font-bold font-mono tabular-nums ${
              deltaPct > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {deltaPct >= 0 ? `+${deltaPct.toFixed(1)}%` : `${deltaPct.toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Interactive Time-Series Chart */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {compareAllPlants ? `${selectedInput} — Planta A / B / C` : `${selectedInput} · ${selectedPlant}`}
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {MONTHS[safeStart]} / {MONTHS[safeEnd]}
          </span>
        </div>
        <ConsumptionLineChart series={series} unit={unit} />
      </section>
    </div>
  );
}
