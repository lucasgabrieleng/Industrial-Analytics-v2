import {
  ConsumptionRecord,
  CorrelationPoint,
  DowntimeCause,
  EquipmentKpi,
  MonthlyOeeRecord,
} from '../types/analytics';

export const INITIAL_OEE_RECORDS: MonthlyOeeRecord[] = [
  { id: 'jan', monthIndex: 0, monthPt: 'Janeiro', monthEn: 'January', shortPt: 'Jan', shortEn: 'Jan', metaAvailability: 95, realAvailability: 93, metaQuality: 98, realQuality: 97, metaPerformance: 90, realPerformance: 88, metaOeeDirect: 85, realOeeDirect: 80 },
  { id: 'feb', monthIndex: 1, monthPt: 'Fevereiro', monthEn: 'February', shortPt: 'Fev', shortEn: 'Feb', metaAvailability: 95, realAvailability: 96, metaQuality: 98, realQuality: 99, metaPerformance: 90, realPerformance: 91, metaOeeDirect: 85, realOeeDirect: 87 },
  { id: 'mar', monthIndex: 2, monthPt: 'Março', monthEn: 'March', shortPt: 'Mar', shortEn: 'Mar', metaAvailability: 95, realAvailability: 94, metaQuality: 98, realQuality: 97, metaPerformance: 90, realPerformance: 89, metaOeeDirect: 85, realOeeDirect: 83 },
  { id: 'apr', monthIndex: 3, monthPt: 'Abril', monthEn: 'April', shortPt: 'Abr', shortEn: 'Apr', metaAvailability: 95, realAvailability: 97, metaQuality: 98, realQuality: 99, metaPerformance: 90, realPerformance: 92, metaOeeDirect: 85, realOeeDirect: 90 },
  { id: 'may', monthIndex: 4, monthPt: 'Maio', monthEn: 'May', shortPt: 'Mai', shortEn: 'May', metaAvailability: 95, realAvailability: 96, metaQuality: 98, realQuality: 98, metaPerformance: 90, realPerformance: 91, metaOeeDirect: 85, realOeeDirect: 88 },
  { id: 'jun', monthIndex: 5, monthPt: 'Junho', monthEn: 'June', shortPt: 'Jun', shortEn: 'Jun', metaAvailability: 95, realAvailability: 94, metaQuality: 98, realQuality: 97, metaPerformance: 90, realPerformance: 89, metaOeeDirect: 85, realOeeDirect: 84 },
  { id: 'jul', monthIndex: 6, monthPt: 'Julho', monthEn: 'July', shortPt: 'Jul', shortEn: 'Jul', metaAvailability: 95, realAvailability: 95, metaQuality: 98, realQuality: 98, metaPerformance: 90, realPerformance: 90, metaOeeDirect: 85, realOeeDirect: 86 },
  { id: 'aug', monthIndex: 7, monthPt: 'Agosto', monthEn: 'August', shortPt: 'Ago', shortEn: 'Aug', metaAvailability: 95, realAvailability: 97, metaQuality: 98, realQuality: 99, metaPerformance: 90, realPerformance: 92, metaOeeDirect: 85, realOeeDirect: 89 },
  { id: 'sep', monthIndex: 8, monthPt: 'Setembro', monthEn: 'September', shortPt: 'Set', shortEn: 'Sep', metaAvailability: 95, realAvailability: 93, metaQuality: 98, realQuality: 96, metaPerformance: 90, realPerformance: 88, metaOeeDirect: 85, realOeeDirect: 82 },
  { id: 'oct', monthIndex: 9, monthPt: 'Outubro', monthEn: 'October', shortPt: 'Out', shortEn: 'Oct', metaAvailability: 95, realAvailability: 98, metaQuality: 98, realQuality: 99, metaPerformance: 90, realPerformance: 93, metaOeeDirect: 85, realOeeDirect: 91 },
  { id: 'nov', monthIndex: 10, monthPt: 'Novembro', monthEn: 'November', shortPt: 'Nov', shortEn: 'Nov', metaAvailability: 95, realAvailability: 96, metaQuality: 98, realQuality: 98, metaPerformance: 90, realPerformance: 91, metaOeeDirect: 85, realOeeDirect: 87 },
  { id: 'dec', monthIndex: 11, monthPt: 'Dezembro', monthEn: 'December', shortPt: 'Dez', shortEn: 'Dec', metaAvailability: 95, realAvailability: 97, metaQuality: 98, realQuality: 99, metaPerformance: 90, realPerformance: 92, metaOeeDirect: 85, realOeeDirect: 88 },
];

export function computeOee(availability: number, quality: number, performance: number): number {
  return Number(((availability * quality * performance) / 10000).toFixed(1));
}

// Exact series from pages/Consumos.py across Planta A, B, C & Insumo 1, 2, 3
const MONTHS_2023 = [
  '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
  '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
];
const MONTH_LABELS = ['Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23'];

const CONSUMPTION_SERIES: Record<'Planta A' | 'Planta B' | 'Planta C', Record<'Insumo 1' | 'Insumo 2' | 'Insumo 3', number[]>> = {
  'Planta A': {
    'Insumo 1': [100, 110, 105, 115, 120, 125, 130, 135, 140, 145, 150, 155],
    'Insumo 2': [90, 95, 85, 100, 105, 110, 115, 120, 125, 130, 135, 140],
    'Insumo 3': [80, 85, 75, 90, 95, 100, 105, 110, 115, 120, 125, 130],
  },
  'Planta B': {
    'Insumo 1': [70, 75, 65, 80, 85, 90, 95, 100, 105, 110, 115, 120],
    'Insumo 2': [60, 65, 55, 70, 75, 80, 85, 90, 95, 100, 105, 110],
    'Insumo 3': [50, 55, 45, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  },
  'Planta C': {
    'Insumo 1': [40, 45, 35, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    'Insumo 2': [30, 35, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    'Insumo 3': [20, 25, 15, 30, 35, 40, 45, 50, 55, 60, 65, 70],
  },
};

const INPUT_UNITS: Record<'Insumo 1' | 'Insumo 2' | 'Insumo 3', string> = {
  'Insumo 1': 'kWh / t',
  'Insumo 2': 'm³ / t',
  'Insumo 3': 'kg / t',
};

export const CONSUMPTION_RECORDS: ConsumptionRecord[] = (['Planta A', 'Planta B', 'Planta C'] as const).flatMap((plant) =>
  (['Insumo 1', 'Insumo 2', 'Insumo 3'] as const).flatMap((input) =>
    MONTHS_2023.map((date, idx) => ({
      date,
      label: MONTH_LABELS[idx],
      plant,
      input,
      consumption: CONSUMPTION_SERIES[plant][input][idx],
      unit: INPUT_UNITS[input],
    }))
  )
);

// Exact correlation dataset from pages/Correlação.py
export const CORRELATION_POINTS: CorrelationPoint[] = [
  { date: '2023-01', label: 'Jan 2023', oee: 85, availability: 95, performance: 92, quality: 99 },
  { date: '2023-02', label: 'Feb 2023', oee: 88, availability: 96, performance: 95, quality: 98 },
  { date: '2023-03', label: 'Mar 2023', oee: 90, availability: 94, performance: 93, quality: 100 },
  { date: '2023-04', label: 'Apr 2023', oee: 92, availability: 97, performance: 98, quality: 95 },
  { date: '2023-05', label: 'May 2023', oee: 87, availability: 95, performance: 97, quality: 93 },
  { date: '2023-06', label: 'Jun 2023', oee: 85, availability: 93, performance: 96, quality: 97 },
  { date: '2023-07', label: 'Jul 2023', oee: 91, availability: 96, performance: 94, quality: 98 },
  { date: '2023-08', label: 'Aug 2023', oee: 89, availability: 94, performance: 90, quality: 99 },
];

// Exact equipment heatmap dataset from pages/Heatmap.py (extended with derived Performance)
export const INITIAL_EQUIPMENT_KPIS: EquipmentKpi[] = [
  { equipment: 'Equipamento A', line: 'Packaging Line 01', oee: 85, availability: 95, quality: 90, performance: 99.4 },
  { equipment: 'Equipamento B', line: 'Extrusion Cell 02', oee: 88, availability: 96, quality: 91, performance: 100.0 },
  { equipment: 'Equipamento C', line: 'CNC Milling 03', oee: 90, availability: 94, quality: 89, performance: 97.6 },
  { equipment: 'Equipamento D', line: 'Robotic Assembly 04', oee: 92, availability: 97, quality: 93, performance: 98.9 },
  { equipment: 'Equipamento E', line: 'Thermal Press 05', oee: 87, availability: 95, quality: 92, performance: 99.5 },
];

// Exact downtime distribution from pages/Piechart.py
export const INITIAL_DOWNTIME_CAUSES: DowntimeCause[] = [
  { id: 'unplanned', causePt: 'Parada Não programada', causeEn: 'Unplanned Downtime', category: 'Unplanned', stops: 25, avgMinutes: 48 },
  { id: 'operational', causePt: 'Parada operacional', causeEn: 'Operational Stop', category: 'Operational', stops: 20, avgMinutes: 22 },
  { id: 'planned', causePt: 'Parada programada', causeEn: 'Planned Maintenance', category: 'Planned', stops: 15, avgMinutes: 65 },
  { id: 'external', causePt: 'Eventos externos', causeEn: 'External Events', category: 'External', stops: 10, avgMinutes: 35 },
  { id: 'other', causePt: 'Outros', causeEn: 'Other Causes', category: 'Other', stops: 5, avgMinutes: 18 },
];

export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const meanX = x.reduce((sum, v) => sum + v, 0) / n;
  const meanY = y.reduce((sum, v) => sum + v, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const denom = Math.sqrt(denX * denY);
  return denom === 0 ? 0 : num / denom;
}

export function calculateLinearRegression(x: number[], y: number[]): { slope: number; intercept: number; r: number; r2: number } {
  const n = Math.min(x.length, y.length);
  if (n < 2) return { slope: 0, intercept: 0, r: 0, r2: 0 };
  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY);
    den += (x[i] - meanX) * (x[i] - meanX);
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  const r = calculatePearsonCorrelation(x, y);
  return { slope, intercept, r, r2: r * r };
}
