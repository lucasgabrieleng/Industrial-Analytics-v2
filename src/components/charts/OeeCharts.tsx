import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SpeedometerGaugeProps {
  value: number;
  target: number;
  label: string;
  aboveTargetText: string;
  belowTargetText: string;
}

export function SpeedometerGauge({
  value,
  target,
  label,
  aboveTargetText,
  belowTargetText,
}: SpeedometerGaugeProps) {
  const { customAccent } = useTheme();
  const clampedVal = Math.max(0, Math.min(100, value));
  const clampedTarget = Math.max(0, Math.min(100, target));
  const delta = Number((clampedVal - clampedTarget).toFixed(1));
  const isPassing = clampedVal >= clampedTarget;

  // Semi-circle arc geometry: from 180 deg (left) to 0 deg (right)
  const cx = 160;
  const cy = 148;
  const r = 112;
  const startAngle = Math.PI;
  const valueAngle = Math.PI - (clampedVal / 100) * Math.PI;
  const targetAngle = Math.PI - (clampedTarget / 100) * Math.PI;

  const polarToCartesian = (angleRad: number, radius: number) => ({
    x: cx + radius * Math.cos(angleRad),
    y: cy - radius * Math.sin(angleRad),
  });

  const bgStart = polarToCartesian(startAngle, r);
  const bgEnd = polarToCartesian(0, r);
  const valEnd = polarToCartesian(valueAngle, r);
  const targetInner = polarToCartesian(targetAngle, r - 14);
  const targetOuter = polarToCartesian(targetAngle, r + 14);
  const needleTip = polarToCartesian(valueAngle, r - 20);

  const arcColor = isPassing ? '#16a34a' : clampedVal >= clampedTarget - 5 ? '#d97706' : '#dc2626';

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox="0 0 320 190" className="w-full max-w-[340px] overflow-visible" role="img" aria-label={`${label}: ${clampedVal}%`}>
        {/* Track arc */}
        <path
          d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Subtle target-passing zone arc */}
        {clampedTarget < 100 && (
          <path
            d={`M ${polarToCartesian(targetAngle, r).x} ${polarToCartesian(targetAngle, r).y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`}
            fill="none"
            stroke="#16a34a"
            strokeOpacity="0.18"
            strokeWidth="18"
          />
        )}

        {/* Active value arc */}
        {clampedVal > 0 && (
          <path
            d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${valEnd.x} ${valEnd.y}`}
            fill="none"
            stroke={arcColor}
            strokeWidth="18"
            strokeLinecap="round"
            style={{ transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        )}

        {/* Scale ticks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const ang = Math.PI - (tick / 100) * Math.PI;
          const p1 = polarToCartesian(ang, r + 14);
          const p2 = polarToCartesian(ang, r + 24);
          return (
            <g key={tick}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={polarToCartesian(ang, r + 18).x}
                y2={polarToCartesian(ang, r + 18).y}
                className="stroke-slate-400 dark:stroke-slate-600"
                strokeWidth="1.5"
              />
              <text
                x={p2.x}
                y={p2.y + 3}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono tabular-nums"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Target threshold marker */}
        <line
          x1={targetInner.x}
          y1={targetInner.y}
          x2={targetOuter.x}
          y2={targetOuter.y}
          stroke={customAccent}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Precision needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          className="stroke-slate-800 dark:stroke-slate-100"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <circle cx={cx} cy={cy} r="5.5" className="fill-slate-800 dark:fill-slate-100" />
        <circle cx={cx} cy={cy} r="2.5" fill={customAccent} />

        {/* Central numeric readout */}
        <text
          x={cx}
          y={cy - 34}
          textAnchor="middle"
          className="fill-slate-900 dark:fill-slate-50 text-[32px] font-bold font-mono tabular-nums"
        >
          {clampedVal.toFixed(1)}%
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
        >
          {label}
        </text>
      </svg>

      <div className="flex items-center gap-3 text-xs font-medium mt-1">
        <span className={isPassing ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
          {isPassing ? aboveTargetText : belowTargetText}
        </span>
        <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
        <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
          {delta >= 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`} vs {clampedTarget}%
        </span>
      </div>
    </div>
  );
}

interface OeeBarTargetProps {
  data: { label: string; fullLabel: string; real: number; meta: number }[];
  metLabel: string;
  missedLabel: string;
  targetLineLabel: string;
}

export function OeeBarTargetChart({ data, metLabel, missedLabel, targetLineLabel }: OeeBarTargetProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { customAccent } = useTheme();

  const w = 720;
  const h = 280;
  const pad = { top: 24, right: 20, bottom: 36, left: 42 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const minY = 65;
  const maxY = 100;
  const yScale = (v: number) => pad.top + ((maxY - Math.max(minY, Math.min(maxY, v))) / (maxY - minY)) * plotH;
  const barStep = plotW / data.length;
  const barW = Math.min(34, barStep * 0.62);

  const metaPoints = data
    .map((d, i) => `${pad.left + i * barStep + barStep / 2},${yScale(d.meta)}`)
    .join(' ');

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center justify-end gap-5 text-xs text-slate-600 dark:text-slate-400 mb-3">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
          {metLabel}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-rose-600 inline-block" />
          {missedLabel}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 border-t-2 border-dashed inline-block" style={{ borderColor: customAccent }} />
          {targetLineLabel}
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[70, 75, 80, 85, 90, 95, 100].map((tick) => {
          const y = yScale(tick);
          return (
            <g key={tick}>
              <line
                x1={pad.left}
                y1={y}
                x2={w - pad.right}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono tabular-nums"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = pad.left + i * barStep + (barStep - barW) / 2;
          const y = yScale(d.real);
          const height = pad.top + plotH - y;
          const isMet = d.real >= d.meta;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <rect
                x={pad.left + i * barStep}
                y={pad.top}
                width={barStep}
                height={plotH}
                fill="transparent"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(2, height)}
                rx="4"
                fill={isMet ? '#16a34a' : '#dc2626'}
                fillOpacity={hoveredIdx === null || isHovered ? 0.9 : 0.45}
                style={{ transition: 'fill-opacity 150ms ease' }}
              />
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className={`text-[10px] font-mono tabular-nums font-medium ${
                  isHovered
                    ? 'fill-slate-900 dark:fill-slate-50'
                    : 'fill-slate-500 dark:fill-slate-400'
                }`}
              >
                {d.real.toFixed(0)}
              </text>
              <text
                x={x + barW / 2}
                y={h - 10}
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Meta line */}
        <polyline
          points={metaPoints}
          fill="none"
          stroke={customAccent}
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        {data.map((d, i) => (
          <circle
            key={`dot-${d.label}`}
            cx={pad.left + i * barStep + barStep / 2}
            cy={yScale(d.meta)}
            r={hoveredIdx === i ? 4.5 : 3}
            fill={customAccent}
          />
        ))}
      </svg>

      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {data[hoveredIdx].fullLabel}
          </span>
          <div className="flex items-center gap-4 font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-300">
              Real: <strong className="text-slate-900 dark:text-white">{data[hoveredIdx].real.toFixed(1)}%</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {targetLineLabel}: <strong>{data[hoveredIdx].meta.toFixed(1)}%</strong>
            </span>
            <span
              className={
                data[hoveredIdx].real >= data[hoveredIdx].meta
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-rose-600 dark:text-rose-400 font-semibold'
              }
            >
              {data[hoveredIdx].real >= data[hoveredIdx].meta ? '+' : ''}
              {(data[hoveredIdx].real - data[hoveredIdx].meta).toFixed(1)} pp
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export interface PillarPoint {
  label: string;
  fullLabel: string;
  availability: number;
  quality: number;
  performance: number;
  oee: number;
  metaOee: number;
}

interface OeePillarsChartProps {
  data: PillarPoint[];
  mode: 'grouped' | 'stacked' | 'area';
  labels: {
    availability: string;
    quality: string;
    performance: string;
    oee: string;
    metaOee: string;
  };
}

export function OeePillarsChart({ data, mode, labels }: OeePillarsChartProps) {
  const { chartPalette } = useTheme();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const w = 740;
  const h = 300;
  const pad = { top: 20, right: 20, bottom: 36, left: 42 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const isStacked = mode === 'stacked';
  const minY = isStacked ? 0 : 70;
  const maxY = isStacked ? 310 : 102;
  const yScale = (v: number) => pad.top + ((maxY - Math.max(minY, Math.min(maxY, v))) / (maxY - minY)) * plotH;
  const step = plotW / data.length;

  const colors = {
    availability: chartPalette[0],
    quality: chartPalette[1],
    performance: chartPalette[2],
    oee: chartPalette[3],
  };

  const seriesMeta = [
    { key: 'availability', label: labels.availability, color: colors.availability },
    { key: 'quality', label: labels.quality, color: colors.quality },
    { key: 'performance', label: labels.performance, color: colors.performance },
    { key: 'oee', label: labels.oee, color: colors.oee },
  ] as const;

  const yTicks = isStacked ? [0, 75, 150, 225, 300] : [70, 80, 90, 100];

  const makePath = (getter: (d: PillarPoint) => number) =>
    data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${pad.left + i * step + step / 2} ${yScale(getter(d))}`)
      .join(' ');

  const makeAreaPath = (getter: (d: PillarPoint) => number) => {
    const line = makePath(getter);
    const lastX = pad.left + (data.length - 1) * step + step / 2;
    const firstX = pad.left + step / 2;
    const baseY = yScale(minY);
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {seriesMeta.map((s) => {
          const isHidden = !!hiddenSeries[s.key];
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggleSeries(s.key)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                isHidden
                  ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: isHidden ? '#94a3b8' : s.color }}
              />
              {s.label}
            </button>
          );
        })}
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={yScale(tick)}
              x2={w - pad.right}
              y2={yScale(tick)}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={yScale(tick) + 4}
              textAnchor="end"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-mono tabular-nums"
            >
              {tick}%
            </text>
          </g>
        ))}

        {mode === 'grouped' &&
          data.map((d, i) => {
            const activeKeys = seriesMeta.filter((s) => !hiddenSeries[s.key]);
            const groupW = step * 0.72;
            const singleW = Math.max(4, groupW / Math.max(1, activeKeys.length) - 2);
            const startX = pad.left + i * step + (step - groupW) / 2;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect x={pad.left + i * step} y={pad.top} width={step} height={plotH} fill="transparent" />
                {activeKeys.map((s, kIdx) => {
                  const val = d[s.key];
                  const y = yScale(val);
                  const bh = pad.top + plotH - y;
                  return (
                    <rect
                      key={s.key}
                      x={startX + kIdx * (singleW + 2)}
                      y={y}
                      width={singleW}
                      height={Math.max(2, bh)}
                      rx="2"
                      fill={s.color}
                      fillOpacity={hoveredIdx === null || hoveredIdx === i ? 0.9 : 0.4}
                    />
                  );
                })}
                <text
                  x={pad.left + i * step + step / 2}
                  y={h - 10}
                  textAnchor="middle"
                  className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

        {mode === 'stacked' &&
          data.map((d, i) => {
            const stackKeys = (['availability', 'quality', 'performance'] as const).filter((k) => !hiddenSeries[k]);
            const barW = Math.min(34, step * 0.6);
            const x = pad.left + i * step + (step - barW) / 2;
            let running = 0;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect x={pad.left + i * step} y={pad.top} width={step} height={plotH} fill="transparent" />
                {stackKeys.map((k) => {
                  const val = d[k];
                  const yBottom = yScale(running);
                  running += val;
                  const yTop = yScale(running);
                  return (
                    <rect
                      key={k}
                      x={x}
                      y={yTop}
                      width={barW}
                      height={Math.max(1, yBottom - yTop)}
                      fill={colors[k]}
                      fillOpacity={hoveredIdx === null || hoveredIdx === i ? 0.88 : 0.45}
                    />
                  );
                })}
                <text
                  x={pad.left + i * step + step / 2}
                  y={h - 10}
                  textAnchor="middle"
                  className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

        {mode === 'area' && (
          <>
            {seriesMeta.map((s) =>
              !hiddenSeries[s.key] ? (
                <g key={s.key}>
                  <path d={makeAreaPath((d) => d[s.key])} fill={s.color} fillOpacity="0.12" />
                  <path d={makePath((d) => d[s.key])} fill="none" stroke={s.color} strokeWidth="2.2" />
                </g>
              ) : null
            )}
            {data.map((d, i) => (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect x={pad.left + i * step} y={pad.top} width={step} height={plotH} fill="transparent" />
                {hoveredIdx === i && (
                  <line
                    x1={pad.left + i * step + step / 2}
                    y1={pad.top}
                    x2={pad.left + i * step + step / 2}
                    y2={pad.top + plotH}
                    className="stroke-slate-400 dark:stroke-slate-600"
                    strokeDasharray="3 3"
                  />
                )}
                <text
                  x={pad.left + i * step + step / 2}
                  y={h - 10}
                  textAnchor="middle"
                  className="fill-slate-600 dark:fill-slate-400 text-[11px] font-medium"
                >
                  {d.label}
                </text>
              </g>
            ))}
          </>
        )}

        {/* Meta OEE line overlay for non-stacked */}
        {!isStacked && (
          <path
            d={makePath((d) => d.metaOee)}
            fill="none"
            className="stroke-slate-500 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {hoveredIdx !== null && data[hoveredIdx] && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums">
          <div className="font-sans font-semibold text-slate-900 dark:text-slate-100">
            {data[hoveredIdx].fullLabel}
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            {labels.availability}: <strong>{data[hoveredIdx].availability}%</strong>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            {labels.quality}: <strong>{data[hoveredIdx].quality}%</strong>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            {labels.performance}: <strong>{data[hoveredIdx].performance}%</strong>
          </div>
          <div className="text-slate-900 dark:text-white font-semibold">
            {labels.oee}: {data[hoveredIdx].oee.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}

interface RadarProps {
  axes: { label: string; real: number; meta: number }[];
}

export function OeeRadarChart({ axes }: RadarProps) {
  const { customAccent, chartPalette } = useTheme();
  const cx = 160;
  const cy = 140;
  const radius = 92;
  const minVal = 65;
  const maxVal = 100;

  const getPoint = (idx: number, val: number) => {
    const angle = -Math.PI / 2 + (idx / axes.length) * Math.PI * 2;
    const norm = Math.max(0.05, (val - minVal) / (maxVal - minVal));
    return {
      x: cx + radius * norm * Math.cos(angle),
      y: cy + radius * norm * Math.sin(angle),
    };
  };

  const metaPoly = axes.map((a, i) => getPoint(i, a.meta)).map((p) => `${p.x},${p.y}`).join(' ');
  const realPoly = axes.map((a, i) => getPoint(i, a.real)).map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 280" className="w-full max-w-[320px] overflow-visible">
        {[70, 80, 90, 100].map((ring) => {
          const norm = (ring - minVal) / (maxVal - minVal);
          const pts = axes
            .map((_, i) => {
              const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
              return `${cx + radius * norm * Math.cos(angle)},${cy + radius * norm * Math.sin(angle)}`;
            })
            .join(' ');
          return (
            <polygon
              key={ring}
              points={pts}
              fill="none"
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {axes.map((a, i) => {
          const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
          const outer = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
          const labelPos = { x: cx + (radius + 24) * Math.cos(angle), y: cy + (radius + 20) * Math.sin(angle) };
          return (
            <g key={a.label}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} className="stroke-slate-200 dark:stroke-slate-800" />
              <text
                x={labelPos.x}
                y={labelPos.y + 4}
                textAnchor="middle"
                className="fill-slate-700 dark:fill-slate-300 text-[11px] font-medium"
              >
                {a.label}
              </text>
            </g>
          );
        })}

        <polygon
          points={metaPoly}
          fill={chartPalette[1]}
          fillOpacity="0.12"
          stroke={chartPalette[1]}
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />
        <polygon
          points={realPoly}
          fill={customAccent}
          fillOpacity="0.22"
          stroke={customAccent}
          strokeWidth="2.4"
        />

        {axes.map((a, i) => {
          const p = getPoint(i, a.real);
          return <circle key={a.label} cx={p.x} cy={p.y} r="4" fill={customAccent} />;
        })}
      </svg>

      <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: customAccent }} />
          Real
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-t-2 border-dashed inline-block" style={{ borderColor: chartPalette[1] }} />
          Meta
        </span>
      </div>
    </div>
  );
}

interface BubblePoint {
  label: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export function OeeBubbleChart({ data }: { data: BubblePoint[] }) {
  const { customAccent, chartPalette } = useTheme();
  const [hovered, setHovered] = useState<BubblePoint | null>(null);

  const w = 480;
  const h = 280;
  const pad = { top: 20, right: 24, bottom: 38, left: 46 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const minX = 91;
  const maxX = 100;
  const minY = 86;
  const maxY = 95;

  const xScale = (v: number) => pad.left + ((v - minX) / (maxX - minX)) * plotW;
  const yScale = (v: number) => pad.top + ((maxY - v) / (maxY - minY)) * plotH;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[92, 94, 96, 98, 100].map((tx) => (
          <g key={`x-${tx}`}>
            <line x1={xScale(tx)} y1={pad.top} x2={xScale(tx)} y2={pad.top + plotH} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={xScale(tx)} y={h - 14} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono tabular-nums">
              {tx}%
            </text>
          </g>
        ))}
        {[86, 88, 90, 92, 94].map((ty) => (
          <g key={`y-${ty}`}>
            <line x1={pad.left} y1={yScale(ty)} x2={w - pad.right} y2={yScale(ty)} className="stroke-slate-200 dark:stroke-slate-800" />
            <text x={pad.left - 8} y={yScale(ty) + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono tabular-nums">
              {ty}%
            </text>
          </g>
        ))}

        {/* Target crosshairs at 95% Avail / 90% Perf */}
        <line
          x1={xScale(95)}
          y1={pad.top}
          x2={xScale(95)}
          y2={pad.top + plotH}
          stroke={chartPalette[1]}
          strokeDasharray="4 4"
          strokeOpacity="0.6"
        />
        <line
          x1={pad.left}
          y1={yScale(90)}
          x2={w - pad.right}
          y2={yScale(90)}
          stroke={chartPalette[1]}
          strokeDasharray="4 4"
          strokeOpacity="0.6"
        />

        {data.map((d) => {
          const cx = xScale(d.availability);
          const cy = yScale(d.performance);
          const r = 7 + ((d.oee - 75) / 20) * 11;
          const isActive = hovered?.label === d.label;

          return (
            <g
              key={d.label}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle
                cx={cx}
                cy={cy}
                r={Math.max(7, r)}
                fill={d.quality >= 98 ? chartPalette[1] : customAccent}
                fillOpacity={isActive ? 0.92 : 0.65}
                stroke={isActive ? '#ffffff' : 'transparent'}
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy - Math.max(7, r) - 4}
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-300 text-[10px] font-medium"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-mono tabular-nums">
          <span className="font-sans font-semibold text-slate-900 dark:text-slate-100">{hovered.label}</span>
          <span className="text-slate-600 dark:text-slate-300">Disp: {hovered.availability}%</span>
          <span className="text-slate-600 dark:text-slate-300">Perf: {hovered.performance}%</span>
          <span className="text-slate-600 dark:text-slate-300">Qual: {hovered.quality}%</span>
          <span className="font-semibold text-slate-900 dark:text-white">OEE: {hovered.oee.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
