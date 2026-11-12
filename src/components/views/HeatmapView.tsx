import React, { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_EQUIPMENT_KPIS } from '../../data/industrialData';
import { COPY } from '../../data/translations';
import { MatrixHeatmap } from '../charts/AnalyticsCharts';

type EquipKpiKey = 'oee' | 'availability' | 'quality' | 'performance';

export function HeatmapView() {
  const { language } = useTheme();
  const t = COPY[language].heatmapView;
  const ov = COPY[language].overview;

  const [selectedCols, setSelectedCols] = useState<EquipKpiKey[]>(['oee', 'availability', 'quality']);
  const [sortBy, setSortBy] = useState<EquipKpiKey>('oee');
  const [sortAsc, setSortAsc] = useState(false);

  const colLabels: Record<EquipKpiKey, string> = {
    oee: 'OEE',
    availability: ov.availability,
    quality: ov.quality,
    performance: ov.performance,
  };

  const toggleCol = (key: EquipKpiKey) => {
    setSelectedCols((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const sortedEquipment = useMemo(() => {
    return [...INITIAL_EQUIPMENT_KPIS].sort((a, b) =>
      sortAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    );
  }, [sortBy, sortAsc]);

  const handleSort = (col: EquipKpiKey) => {
    if (sortBy === col) {
      setSortAsc((a) => !a);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
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

      {/* Variable Selector & Heatmap */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.selectVariables}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(colLabels) as EquipKpiKey[]).map((key) => {
              const active = selectedCols.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleCol(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {colLabels[key]}
                </button>
              );
            })}
          </div>
        </div>

        <MatrixHeatmap
          rows={sortedEquipment.map((e) => e.equipment)}
          columns={selectedCols.map((c) => colLabels[c])}
          values={sortedEquipment.map((e) => selectedCols.map((c) => e[c]))}
          minVal={84}
          maxVal={100}
          unit="%"
        />
      </section>

      {/* Asset Benchmark Ledger */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {t.benchmarkTable}
        </h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <th className="text-left py-2.5 pr-4 font-medium">{t.equipment}</th>
              <th className="text-left py-2.5 px-4 font-medium">{t.line}</th>
              {(['oee', 'availability', 'quality', 'performance'] as EquipKpiKey[]).map((col) => (
                <th key={col} className="text-right py-2.5 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort(col)}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                  >
                    {colLabels[col]}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              ))}
              <th className="text-right py-2.5 pl-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedEquipment.map((eq) => {
              const needsAttention = eq.oee < 88 || eq.quality < 90;
              return (
                <tr key={eq.equipment} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {eq.equipment}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {eq.line}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {eq.oee.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {eq.availability.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {eq.quality.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {eq.performance.toFixed(1)}%
                  </td>
                  <td
                    className={`py-3 pl-4 text-right font-medium whitespace-nowrap ${
                      needsAttention
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {needsAttention ? t.bottleneck : t.nominal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
