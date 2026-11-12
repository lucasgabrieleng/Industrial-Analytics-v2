import React, { useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  CORRELATION_POINTS,
  calculateLinearRegression,
  calculatePearsonCorrelation,
} from '../../data/industrialData';
import { COPY } from '../../data/translations';
import { CorrelationScatterChart, MatrixHeatmap } from '../charts/AnalyticsCharts';

type MetricKey = 'oee' | 'availability' | 'performance' | 'quality';

export function CorrelacaoView() {
  const { language } = useTheme();
  const t = COPY[language].correlacaoView;
  const ov = COPY[language].overview;

  const metricLabels: Record<MetricKey, string> = {
    oee: 'OEE',
    availability: ov.availability,
    performance: ov.performance,
    quality: ov.quality,
  };

  const [xAxis, setXAxis] = useState<MetricKey>('availability');
  const [yAxis, setYAxis] = useState<MetricKey>('oee');
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(CORRELATION_POINTS.length - 1);
  const [matrixVars, setMatrixVars] = useState<MetricKey[]>(['oee', 'availability', 'performance', 'quality']);

  const safeStart = Math.min(startIdx, endIdx);
  const safeEnd = Math.max(startIdx, endIdx);
  const filteredPoints = CORRELATION_POINTS.slice(safeStart, safeEnd + 1);

  const regression = useMemo(() => {
    const xs = filteredPoints.map((p) => p[xAxis]);
    const ys = filteredPoints.map((p) => p[yAxis]);
    return calculateLinearRegression(xs, ys);
  }, [filteredPoints, xAxis, yAxis]);

  const toggleMatrixVar = (key: MetricKey) => {
    setMatrixVars((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 2) return prev; // keep at least 2x2
        return prev.filter((v) => v !== key);
      }
      return [...prev, key];
    });
  };

  const matrixValues = useMemo(() => {
    return matrixVars.map((rowKey) =>
      matrixVars.map((colKey) => {
        const xs = filteredPoints.map((p) => p[rowKey]);
        const ys = filteredPoints.map((p) => p[colKey]);
        return calculatePearsonCorrelation(xs, ys);
      })
    );
  }, [matrixVars, filteredPoints]);

  const strengthLabel =
    regression.r >= 0.7
      ? t.strongPos
      : regression.r >= 0.3
      ? t.moderate
      : regression.r <= -0.3
      ? t.negative
      : t.weak;

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

      {/* Controls */}
      <section className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        <div>
          <label htmlFor="corr-x" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t.xAxis}
          </label>
          <select
            id="corr-x"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value as MetricKey)}
            className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {(Object.keys(metricLabels) as MetricKey[]).map((k) => (
              <option key={k} value={k}>
                {metricLabels[k]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="corr-y" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {t.yAxis}
          </label>
          <select
            id="corr-y"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value as MetricKey)}
            className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {(Object.keys(metricLabels) as MetricKey[]).map((k) => (
              <option key={k} value={k}>
                {metricLabels[k]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {COPY[language].consumosView.dateRange}
          </label>
          <div className="flex items-center gap-2">
            <select
              value={safeStart}
              onChange={(e) => setStartIdx(Number(e.target.value))}
              className="flex-1 px-2.5 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {CORRELATION_POINTS.map((p, idx) => (
                <option key={p.date} value={idx} disabled={idx > safeEnd}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-400">-</span>
            <select
              value={safeEnd}
              onChange={(e) => setEndIdx(Number(e.target.value))}
              className="flex-1 px-2.5 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {CORRELATION_POINTS.map((p, idx) => (
                <option key={p.date} value={idx} disabled={idx < safeStart}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Scatter + OLS Regression */}
        <section className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {t.scatterTitle}: {metricLabels[yAxis]} vs {metricLabels[xAxis]}
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {strengthLabel}
              </span>
            </div>

            <CorrelationScatterChart
              points={filteredPoints.map((p) => ({
                label: p.label,
                x: p[xAxis],
                y: p[yAxis],
              }))}
              xLabel={metricLabels[xAxis]}
              yLabel={metricLabels[yAxis]}
              slope={regression.slope}
              intercept={regression.intercept}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{t.pearsonR}</span>
              <span className="font-mono tabular-nums text-base font-bold text-slate-900 dark:text-slate-50">
                {regression.r.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{t.rSquared}</span>
              <span className="font-mono tabular-nums text-base font-bold text-slate-900 dark:text-slate-50">
                {regression.r2.toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">{t.regressionEq}</span>
              <span className="font-mono tabular-nums text-xs font-semibold text-slate-900 dark:text-slate-100">
                y = {regression.slope.toFixed(2)}x {regression.intercept >= 0 ? '+' : ''}
                {regression.intercept.toFixed(1)}
              </span>
            </div>
          </div>
        </section>

        {/* Correlation Matrix */}
        <section className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
              {t.matrixTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t.selectMatrixVars}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {(Object.keys(metricLabels) as MetricKey[]).map((k) => {
                const active = matrixVars.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleMatrixVar(k)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {metricLabels[k]}
                  </button>
                );
              })}
            </div>

            <MatrixHeatmap
              rows={matrixVars.map((k) => metricLabels[k])}
              columns={matrixVars.map((k) => metricLabels[k])}
              values={matrixValues}
              minVal={-1}
              maxVal={1}
              mode="correlation"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            n = {filteredPoints.length} months · Pearson product-moment coefficient
          </div>
        </section>
      </div>
    </div>
  );
}
