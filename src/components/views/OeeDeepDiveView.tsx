import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { COPY } from '../../data/translations';
import { computeOee } from '../../data/industrialData';
import { MonthlyOeeRecord } from '../../types/analytics';
import {
  OeeBarTargetChart,
  OeeBubbleChart,
  OeePillarsChart,
  OeeRadarChart,
} from '../charts/OeeCharts';
import { MatrixHeatmap } from '../charts/AnalyticsCharts';

interface OeeDeepDiveViewProps {
  records: MonthlyOeeRecord[];
  onUpdateRecord: (id: string, field: 'realAvailability' | 'realQuality' | 'realPerformance' | 'realOeeDirect', value: number) => void;
}

export function OeeDeepDiveView({ records, onUpdateRecord }: OeeDeepDiveViewProps) {
  const { language } = useTheme();
  const t = COPY[language].oeeView;
  const ov = COPY[language].overview;

  const [pillarMode, setPillarMode] = useState<'grouped' | 'stacked' | 'area'>('grouped');
  const [selectedMonthId, setSelectedMonthId] = useState<string>(records[0]?.id ?? 'jan');
  const [showEditor, setShowEditor] = useState(false);

  const monthLabel = (r: MonthlyOeeRecord) => (language === 'pt' ? r.monthPt : r.monthEn);
  const shortLabel = (r: MonthlyOeeRecord) => (language === 'pt' ? r.shortPt : r.shortEn);

  const targetBarData = records.map((r) => ({
    label: shortLabel(r),
    fullLabel: monthLabel(r),
    real: r.realOeeDirect,
    meta: r.metaOeeDirect,
  }));

  const pillarSeries = records.map((r) => ({
    label: shortLabel(r),
    fullLabel: monthLabel(r),
    availability: r.realAvailability,
    quality: r.realQuality,
    performance: r.realPerformance,
    oee: computeOee(r.realAvailability, r.realQuality, r.realPerformance),
    metaOee: computeOee(r.metaAvailability, r.metaQuality, r.metaPerformance),
  }));

  const focusedRecord = records.find((r) => r.id === selectedMonthId) ?? records[0];
  const radarAxes = focusedRecord
    ? [
        { label: ov.availability, real: focusedRecord.realAvailability, meta: focusedRecord.metaAvailability },
        { label: ov.quality, real: focusedRecord.realQuality, meta: focusedRecord.metaQuality },
        { label: ov.performance, real: focusedRecord.realPerformance, meta: focusedRecord.metaPerformance },
        {
          label: 'OEE',
          real: computeOee(focusedRecord.realAvailability, focusedRecord.realQuality, focusedRecord.realPerformance),
          meta: computeOee(focusedRecord.metaAvailability, focusedRecord.metaQuality, focusedRecord.metaPerformance),
        },
      ]
    : [];

  const bubblePoints = records.map((r) => ({
    label: shortLabel(r),
    availability: r.realAvailability,
    performance: r.realPerformance,
    quality: r.realQuality,
    oee: computeOee(r.realAvailability, r.realQuality, r.realPerformance),
  }));

  const heatmapRows = [
    ov.availability,
    ov.quality,
    ov.performance,
    'OEE',
  ];
  const heatmapCols = records.map((r) => shortLabel(r));
  const heatmapValues = [
    records.map((r) => r.realAvailability),
    records.map((r) => r.realQuality),
    records.map((r) => r.realPerformance),
    records.map((r) => computeOee(r.realAvailability, r.realQuality, r.realPerformance)),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEditor((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {showEditor ? t.closeEditor : t.editMonthly}
        </button>
      </div>

      {showEditor && (
        <section className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="text-left py-2 pr-4 font-medium">Month</th>
                <th className="text-right py-2 px-3 font-medium">{ov.availability} (%)</th>
                <th className="text-right py-2 px-3 font-medium">{ov.quality} (%)</th>
                <th className="text-right py-2 px-3 font-medium">{ov.performance} (%)</th>
                <th className="text-right py-2 pl-3 font-medium">OEE (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2 pr-4 font-medium text-slate-900 dark:text-slate-100">
                    {monthLabel(r)}
                  </td>
                  {(['realAvailability', 'realQuality', 'realPerformance', 'realOeeDirect'] as const).map((field) => (
                    <td key={field} className="py-1.5 px-3 text-right">
                      <input
                        type="number"
                        min={50}
                        max={100}
                        value={r[field]}
                        onChange={(e) => onUpdateRecord(r.id, field, Math.max(50, Math.min(100, Number(e.target.value) || 0)))}
                        className="w-16 px-2 py-1 text-right font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Row 1: Monthly Target Attainment */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {t.targetChartTitle}
        </h2>
        <OeeBarTargetChart
          data={targetBarData}
          metLabel={t.targetMet}
          missedLabel={t.targetMissed}
          targetLineLabel={t.targetLine}
        />
      </section>

      {/* Row 2: Pillars Multi-Mode Chart (Grouped / Stacked / Area) */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {t.pillarsChartTitle}
          </h2>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {([
              { id: 'grouped', label: t.modeGrouped },
              { id: 'stacked', label: t.modeStacked },
              { id: 'area', label: t.modeArea },
            ] as const).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPillarMode(m.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  pillarMode === m.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <OeePillarsChart
          data={pillarSeries}
          mode={pillarMode}
          labels={{
            availability: ov.availability,
            quality: ov.quality,
            performance: ov.performance,
            oee: 'OEE',
            metaOee: t.targetLine,
          }}
        />
      </section>

      {/* Row 3: Radar Profile + Availability/Performance Bubble Quadrant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {t.radarTitle}
            </h2>
            <select
              aria-label={t.selectMonth}
              value={selectedMonthId}
              onChange={(e) => setSelectedMonthId(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {monthLabel(r)}
                </option>
              ))}
            </select>
          </div>
          <OeeRadarChart axes={radarAxes} />
        </section>

        <section className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
            {t.bubbleTitle}
          </h2>
          <OeeBubbleChart data={bubblePoints} />
        </section>
      </div>

      {/* Row 4: Annual Heatmap Matrix */}
      <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4">
          {t.heatmapTitle}
        </h2>
        <MatrixHeatmap
          rows={heatmapRows}
          columns={heatmapCols}
          values={heatmapValues}
          minVal={75}
          maxVal={100}
          unit="%"
        />
      </section>
    </div>
  );
}
