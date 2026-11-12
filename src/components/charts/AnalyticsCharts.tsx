import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HeatmapProps {
  rows: string[];
  columns: string[];
  values: number[][]; // [row][col]
  minVal: number;
  maxVal: number;
  unit?: string;
  mode?: 'performance' | 'correlation';
}

export function MatrixHeatmap({
  rows,
  columns,
  values,
  minVal,
  maxVal,
  unit = '%',
  mode = 'performance',
}: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  const getCellStyle = (val: number): { bg: string; text: string } => {
    if (mode === 'correlation') {
      // -1 (rose) -> 0 (neutral) -> +1 (emerald/cobalt)
      const clamped = Math.max(-1, Math.min(1, val));
      if (clamped >= 0.75) return { bg: 'bg-blue-600 dark:bg-blue-500', text: 'text-white' };
      if (clamped >= 0.4) return { bg: 'bg-blue-400/75 dark:bg-blue-600/70', text: 'text-slate-950 dark:text-white' };
      if (clamped >= 0.1) return { bg: 'bg-blue-200/70 dark:bg-blue-900/60', text: 'text-slate-900 dark:text-slate-100' };
      if (clamped > -0.1) return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
      if (clamped > -0.5) return { bg: 'bg-rose-200/80 dark:bg-rose-900/50', text: 'text-slate-900 dark:text-rose-100' };
      return { bg: 'bg-rose-600 dark:bg-rose-500', text: 'text-white' };
    }

    const norm = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
    if (norm >= 0.8) return { bg: 'bg-emerald-600 dark:bg-emerald-600', text: 'text-white' };
    if (norm >= 0.6) return { bg: 'bg-emerald-500/75 dark:bg-emerald-700/80', text: 'text-slate-950 dark:text-white' };
    if (norm >= 0.4) return { bg: 'bg-amber-300/80 dark:bg-amber-700/70', text: 'text-slate-900 dark:text-amber-50' };
    if (norm >= 0.2) return { bg: 'bg-orange-300/85 dark:bg-orange-800/75', text: 'text-slate-900 dark:text-orange-50' };
    return { bg: 'bg-rose-500/85 dark:bg-rose-700/85', text: 'text-white' };
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="text-left py-2 px-2 font-medium text-slate-500 dark:text-slate-400" />
            {columns.map((col, cIdx) => (
              <th
                key={col}
                className={`py-2 px-2 text-center font-semibold whitespace-nowrap ${
                  hoveredCell?.c === cIdx
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={row}>
              <td
                className={`py-2 px-2 font-medium whitespace-nowrap ${
                  hoveredCell?.r === rIdx
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {row}
              </td>
              {columns.map((col, cIdx) => {
                const val = values[rIdx]?.[cIdx] ?? 0;
                const style = getCellStyle(val);
                const isActive = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;
                return (
                  <td
                    key={`${row}-${col}`}
                    onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`rounded-md py-2.5 px-2 text-center font-mono tabular-nums font-semibold transition-transform cursor-default ${style.bg} ${style.text} ${
                      isActive ? 'ring-2 ring-slate-900 dark:ring-white scale-[1.03]' : ''
                    }`}
                  >
                    {mode === 'correlation' ? val.toFixed(2) : `${val.toFixed(1)}${unit}`}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface LineSeries {
  name: string;
  color: string;
  points: { label: string; value: number }[];
}

export function ConsumptionLineChart({ series, unit }: { series: LineSeries[]; unit: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const w = 740;
  const h = 290;
  const pad = { top: 20, right: 24, bottom: 38, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const allVals = series.flatMap((s) => s.points.map((p) => p.value));
  const rawMin = allVals.length ? Math.min(...allVals) : 0;
  const rawMax = allVals.length ? Math.max(...allVals) : 100;
  const minY = Math.max(0, Math.floor((rawMin - 10) / 10) * 10);
  const maxY = Math.ceil((rawMax + 10) / 10) * 10;

  const labels = series[0]?.points.map((p) => p.label) ?? [];
  const stepX = labels.length > 1 ? plotW / (labels.length - 1) : plotW;
  const xPos = (idx: number) => (labels.length > 1 ? pad.left + idx * stepX : pad.left + plotW / 2);
  const yScale = (v: number) =>
    pad.top + ((maxY - v) / Math.max(1, maxY - minY)) * plotH;

  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round(minY + ((maxY - minY) * i) / 4));

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-5 mb-3 text-xs text-slate-600 dark:text-slate-400">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-2 font-medium">
            <span className="w-3 h-0.5 inline-block rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              y1={yScale(t)}
              x2={w - pad.right}
              y2={yScale(t)}
              className="stroke-slate-200 dark:stroke-slate-800"
            />
            <text
              x={pad.left - 8}
              y={yScale(t) + 4}
              textAnchor="end"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono tabular-nums"
            >
              {t}
            </text>
          </g>
        ))}

        {series.map((s) => {
          const path = s.points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yScale(p.value)}`)
            .join(' ');
          const area =
            s.points.length > 1
              ? `${path} L ${xPos(s.points.length - 1)} ${yScale(minY)} L ${xPos(0)} ${yScale(minY)} Z`
              : '';
          return (
            <g key={s.name}>
              {series.length === 1 && area && <path d={area} fill={s.color} fillOpacity="0.12" />}
              <path d={path} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" />
              {s.points.map((p, i) => (
                <circle
                  key={`${s.name}-${p.label}`}
                  cx={xPos(i)}
                  cy={yScale(p.value)}
                  r={hoveredIdx === i ? 5 : 3.2}
                  fill={s.color}
                  className="stroke-white dark:stroke-slate-900"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          );
        })}

        {labels.map((lbl, i) => (
          <g
            key={lbl}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer"
          >
            <rect
              x={xPos(i) - Math.max(12, stepX / 2)}
              y={pad.top}
              width={Math.max(24, stepX)}
              height={plotH}
              fill="transparent"
            />
            {hoveredIdx === i && (
              <line
                x1={xPos(i)}
                y1={pad.top}
                x2={xPos(i)}
                y2={pad.top + plotH}
                className="stroke-slate-400 dark:stroke-slate-600"
                strokeDasharray="3 3"
              />
            )}
            <text
              x={xPos(i)}
              y={h - 12}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px] font-medium"
            >
              {lbl}
            </text>
          </g>
        ))}
      </svg>

      {hoveredIdx !== null && labels[hoveredIdx] && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums">
          <span className="font-sans font-semibold text-slate-900 dark:text-slate-100">{labels[hoveredIdx]}</span>
          <div className="flex flex-wrap items-center gap-4">
            {series.map((s) => (
              <span key={s.name} className="text-slate-700 dark:text-slate-300">
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />
                {s.name}: <strong>{s.points[hoveredIdx]?.value}</strong> {unit}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScatterProps {
  points: { label: string; x: number; y: number }[];
  xLabel: string;
  yLabel: string;
  slope: number;
  intercept: number;
}

export function CorrelationScatterChart({ points, xLabel, yLabel, slope, intercept }: ScatterProps) {
  const { customAccent, chartPalette } = useTheme();
  const [hovered, setHovered] = useState<{ label: string; x: number; y: number } | null>(null);

  const w = 520;
  const h = 300;
  const pad = { top: 20, right: 24, bottom: 42, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.floor((Math.min(...xs) - 1) / 2) * 2;
  const maxX = Math.ceil((Math.max(...xs) + 1) / 2) * 2;
  const minY = Math.floor((Math.min(...ys) - 1) / 2) * 2;
  const maxY = Math.ceil((Math.max(...ys) + 1) / 2) * 2;

  const xScale = (v: number) => pad.left + ((v - minX) / Math.max(1, maxX - minX)) * plotW;
  const yScale = (v: number) => pad.top + ((maxY - v) / Math.max(1, maxY - minY)) * plotH;

  const regStartY = slope * minX + intercept;
  const regEndY = slope * maxX + intercept;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const xv = Math.round((minX + (maxX - minX) * t) * 10) / 10;
          const yv = Math.round((minY + (maxY - minY) * t) * 10) / 10;
          return (
            <g key={t}>
              <line x1={xScale(xv)} y1={pad.top} x2={xScale(xv)} y2={pad.top + plotH} className="stroke-slate-200 dark:stroke-slate-800" />
              <line x1={pad.left} y1={yScale(yv)} x2={w - pad.right} y2={yScale(yv)} className="stroke-slate-200 dark:stroke-slate-800" />
              <text x={xScale(xv)} y={h - 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono tabular-nums">
                {xv}%
              </text>
              <text x={pad.left - 8} y={yScale(yv) + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono tabular-nums">
                {yv}%
              </text>
            </g>
          );
        })}

        <text x={pad.left + plotW / 2} y={h - 2} textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium">
          {xLabel}
        </text>
        <text
          x={14}
          y={pad.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${pad.top + plotH / 2})`}
          className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium"
        >
          {yLabel}
        </text>

        {/* Linear Regression line */}
        {points.length >= 2 && (
          <line
            x1={xScale(minX)}
            y1={yScale(Math.max(minY, Math.min(maxY, regStartY)))}
            x2={xScale(maxX)}
            y2={yScale(Math.max(minY, Math.min(maxY, regEndY)))}
            stroke={chartPalette[1]}
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}

        {points.map((p) => {
          const isActive = hovered?.label === p.label;
          return (
            <g
              key={p.label}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                cx={xScale(p.x)}
                cy={yScale(p.y)}
                r={isActive ? 7 : 5.5}
                fill={customAccent}
                fillOpacity="0.88"
                className="stroke-white dark:stroke-slate-900"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums">
          <span className="font-sans font-semibold text-slate-900 dark:text-slate-100">{hovered.label}</span>
          <span className="text-slate-600 dark:text-slate-300">
            {xLabel}: <strong>{hovered.x}%</strong> · {yLabel}: <strong>{hovered.y}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}

export interface DonutSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

export function DowntimeDonutChart({
  slices,
  activeId,
  onHover,
  totalLabel,
}: {
  slices: DonutSlice[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  totalLabel: string;
}) {
  const total = slices.reduce((acc, s) => acc + s.value, 0);
  const cx = 130;
  const cy = 130;
  const r = 92;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 260" className="w-full max-w-[260px]">
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="34" />
        ) : (
          slices.map((s) => {
            const frac = s.value / total;
            const dash = frac * circumference;
            const offset = -cumulative * circumference;
            cumulative += frac;
            const isHovered = activeId === s.id;

            return (
              <circle
                key={s.id}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={isHovered ? 40 : 34}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                onMouseEnter={() => onHover(s.id)}
                onMouseLeave={() => onHover(null)}
                className="cursor-pointer transition-all duration-150"
                style={{ opacity: activeId && !isHovered ? 0.45 : 1 }}
              />
            );
          })
        )}

        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-slate-900 dark:fill-slate-50 text-[28px] font-bold font-mono tabular-nums"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
        >
          {totalLabel}
        </text>
      </svg>
    </div>
  );
}
