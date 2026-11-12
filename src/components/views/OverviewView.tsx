import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { COPY } from '../../data/translations';
import { computeOee } from '../../data/industrialData';
import { MonthlyOeeRecord } from '../../types/analytics';
import { SpeedometerGauge } from '../charts/OeeCharts';

interface OverviewViewProps {
  oeeRecords: MonthlyOeeRecord[];
  onNavigate: (view: 'oee' | 'heatmap' | 'paradas') => void;
}

export function OverviewView({ oeeRecords, onNavigate }: OverviewViewProps) {
  const { language, customAccent } = useTheme();
  const t = COPY[language].overview;

  // Interactive simulator state (expanded from Home.py tab3)
  const [simAvail, setSimAvail] = useState(95);
  const [simPerf, setSimPerf] = useState(91);
  const [simQual, setSimQual] = useState(98);
  const [simTarget, setSimTarget] = useState(85);

  const simulatedOee = computeOee(simAvail, simQual, simPerf);

  // Annual summary stats from records
  const avgAvail = oeeRecords.reduce((s, r) => s + r.realAvailability, 0) / oeeRecords.length;
  const avgPerf = oeeRecords.reduce((s, r) => s + r.realPerformance, 0) / oeeRecords.length;
  const avgQual = oeeRecords.reduce((s, r) => s + r.realQuality, 0) / oeeRecords.length;
  const avgOee = oeeRecords.reduce((s, r) => s + computeOee(r.realAvailability, r.realQuality, r.realPerformance), 0) / oeeRecords.length;

  const targetAvail = oeeRecords[0]?.metaAvailability ?? 95;
  const targetPerf = oeeRecords[0]?.metaPerformance ?? 90;
  const targetQual = oeeRecords[0]?.metaQuality ?? 98;
  const targetOee = computeOee(targetAvail, targetQual, targetPerf);

  const kpis = [
    {
      label: t.avgOee,
      value: avgOee,
      target: targetOee,
      onClick: () => onNavigate('oee'),
    },
    {
      label: t.availability,
      value: avgAvail,
      target: targetAvail,
      onClick: () => onNavigate('paradas'),
    },
    {
      label: t.performance,
      value: avgPerf,
      target: targetPerf,
      onClick: () => onNavigate('oee'),
    },
    {
      label: t.quality,
      value: avgQual,
      target: targetQual,
      onClick: () => onNavigate('heatmap'),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* 4-column flat KPI summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const delta = k.value - k.target;
          const met = delta >= 0;
          return (
            <button
              key={k.label}
              type="button"
              onClick={k.onClick}
              className="text-left p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {k.label}
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
                  {k.value.toFixed(1)}%
                </span>
                <span
                  className={`text-xs font-mono tabular-nums font-semibold ${
                    met ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} pp
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>{t.targetLabel}: {k.target.toFixed(1)}%</span>
                <span aria-hidden="true">·</span>
                <span className={met ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                  {met ? t.aboveTarget : t.belowTarget}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Split: Interactive Speedometer Simulator + OEE Three Pillars Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {t.simulatorTitle}
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.worldClass}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {t.simulatorDesc}
            </p>
          </div>

          <div className="my-6">
            <SpeedometerGauge
              value={simulatedOee}
              target={simTarget}
              label={t.calculatedOee}
              aboveTargetText={t.aboveTarget}
              belowTargetText={t.belowTarget}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-avail" className="font-medium text-slate-700 dark:text-slate-300">
                  {t.availSlider}
                </label>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {simAvail}%
                </span>
              </div>
              <input
                id="sim-avail"
                type="range"
                min={50}
                max={100}
                value={simAvail}
                onChange={(e) => setSimAvail(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-perf" className="font-medium text-slate-700 dark:text-slate-300">
                  {t.perfSlider}
                </label>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {simPerf}%
                </span>
              </div>
              <input
                id="sim-perf"
                type="range"
                min={50}
                max={100}
                value={simPerf}
                onChange={(e) => setSimPerf(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-qual" className="font-medium text-slate-700 dark:text-slate-300">
                  {t.qualSlider}
                </label>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                  {simQual}%
                </span>
              </div>
              <input
                id="sim-qual"
                type="range"
                min={50}
                max={100}
                value={simQual}
                onChange={(e) => setSimQual(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-target" className="font-medium text-slate-700 dark:text-slate-300">
                  {t.targetOeeSlider}
                </label>
                <span className="font-mono tabular-nums font-semibold" style={{ color: customAccent }}>
                  {simTarget}%
                </span>
              </div>
              <input
                id="sim-target"
                type="range"
                min={60}
                max={95}
                value={simTarget}
                onChange={(e) => setSimTarget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Right Column: OEE Methodology & Pillar Contributions */}
        <section className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {t.pillarsDefinitionTitle}
            </h2>
            <p className="mt-2 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              OEE = ({simAvail}% × {simPerf}% × {simQual}%) / 10,000 = {simulatedOee.toFixed(1)}%
            </p>

            <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pb-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span>01. {t.availability}</span>
                  <span className="font-mono tabular-nums">{simAvail}%</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.availDef}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{ width: `${simAvail}%`, backgroundColor: customAccent }}
                  />
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span>02. {t.performance}</span>
                  <span className="font-mono tabular-nums">{simPerf}%</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.perfDef}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150 bg-teal-600 dark:bg-teal-400"
                    style={{ width: `${simPerf}%` }}
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span>03. {t.quality}</span>
                  <span className="font-mono tabular-nums">{simQual}%</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.qualDef}
                </p>
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-150 bg-amber-600 dark:bg-amber-400"
                    style={{ width: `${simQual}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Lucas Gabriel · Industrial Analytics</span>
            <button
              type="button"
              onClick={() => {
                setSimAvail(95);
                setSimPerf(91);
                setSimQual(98);
                setSimTarget(85);
              }}
              className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white underline underline-offset-4"
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
