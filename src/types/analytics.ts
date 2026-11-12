export type NavView =
  | 'overview'
  | 'oee'
  | 'consumos'
  | 'correlacao'
  | 'heatmap'
  | 'paradas';

export type Language = 'en' | 'pt';

export interface MonthlyOeeRecord {
  id: string;
  monthIndex: number;
  monthPt: string;
  monthEn: string;
  shortPt: string;
  shortEn: string;
  metaAvailability: number;
  realAvailability: number;
  metaQuality: number;
  realQuality: number;
  metaPerformance: number;
  realPerformance: number;
  metaOeeDirect: number; // From tab1 (85%)
  realOeeDirect: number; // From tab1 (80, 87, 83...)
}

export interface ConsumptionRecord {
  date: string; // YYYY-MM
  label: string;
  plant: 'Planta A' | 'Planta B' | 'Planta C';
  input: 'Insumo 1' | 'Insumo 2' | 'Insumo 3';
  consumption: number;
  unit: string;
}

export interface CorrelationPoint {
  date: string;
  label: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface EquipmentKpi {
  equipment: string;
  line: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface DowntimeCause {
  id: string;
  causePt: string;
  causeEn: string;
  category: 'Planned' | 'Unplanned' | 'External' | 'Operational' | 'Other';
  stops: number;
  avgMinutes: number;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  defaultMode: 'light' | 'dark';
  accentPrimary: string;
  accentHover: string;
  chartPalette: [string, string, string, string, string];
  streamlitBase: 'light' | 'dark';
}
