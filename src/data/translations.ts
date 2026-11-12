import { Language } from '../types/analytics';

export const COPY: Record<
  Language,
  {
    appTitle: string;
    nav: {
      overview: string;
      oee: string;
      consumos: string;
      correlacao: string;
      heatmap: string;
      paradas: string;
    };
    actions: {
      themeStudio: string;
      resetData: string;
      lightMode: string;
      darkMode: string;
      exportSpec: string;
    };
    overview: {
      title: string;
      subtitle: string;
      avgOee: string;
      availability: string;
      performance: string;
      quality: string;
      targetLabel: string;
      simulatorTitle: string;
      simulatorDesc: string;
      targetOeeSlider: string;
      availSlider: string;
      perfSlider: string;
      qualSlider: string;
      calculatedOee: string;
      pillarsDefinitionTitle: string;
      availDef: string;
      perfDef: string;
      qualDef: string;
      worldClass: string;
      aboveTarget: string;
      belowTarget: string;
    };
    oeeView: {
      title: string;
      subtitle: string;
      targetChartTitle: string;
      pillarsChartTitle: string;
      radarTitle: string;
      bubbleTitle: string;
      heatmapTitle: string;
      modeGrouped: string;
      modeStacked: string;
      modeArea: string;
      selectMonth: string;
      editMonthly: string;
      closeEditor: string;
      targetMet: string;
      targetMissed: string;
      targetLine: string;
    };
    consumosView: {
      title: string;
      subtitle: string;
      selectPlant: string;
      selectInput: string;
      comparePlants: string;
      dateRange: string;
      from: string;
      to: string;
      avgConsumption: string;
      peakConsumption: string;
      minConsumption: string;
      periodDelta: string;
    };
    correlacaoView: {
      title: string;
      subtitle: string;
      xAxis: string;
      yAxis: string;
      scatterTitle: string;
      matrixTitle: string;
      selectMatrixVars: string;
      pearsonR: string;
      rSquared: string;
      regressionEq: string;
      strongPos: string;
      moderate: string;
      weak: string;
      negative: string;
    };
    heatmapView: {
      title: string;
      subtitle: string;
      selectVariables: string;
      benchmarkTable: string;
      equipment: string;
      line: string;
      bottleneck: string;
      nominal: string;
    };
    paradasView: {
      title: string;
      subtitle: string;
      donutTitle: string;
      paretoTitle: string;
      totalStops: string;
      topCause: string;
      estDowntime: string;
      addCause: string;
      causeName: string;
      stopsCount: string;
      avgMin: string;
      share: string;
      cumulative: string;
    };
  }
> = {
  en: {
    appTitle: 'Industrial Analytics',
    nav: {
      overview: 'Overview & Simulator',
      oee: 'OEE & Pillars',
      consumos: 'Utility Consumption',
      correlacao: 'Correlation Matrix',
      heatmap: 'Equipment Heatmap',
      paradas: 'Downtime Pareto',
    },
    actions: {
      themeStudio: 'Theme Studio',
      resetData: 'Reset Data',
      lightMode: 'Light',
      darkMode: 'Dark',
      exportSpec: 'Export Spec',
    },
    overview: {
      title: 'Plant Performance & OEE Simulator',
      subtitle: 'Interactive executive summary of Overall Equipment Effectiveness and live pillar sensitivity testing.',
      avgOee: 'Annual Mean OEE',
      availability: 'Availability',
      performance: 'Performance',
      quality: 'Quality',
      targetLabel: 'Target',
      simulatorTitle: 'Live OEE Speedometer Simulator',
      simulatorDesc: 'Adjust the three OEE pillars or target threshold to evaluate real-time equipment effectiveness.',
      targetOeeSlider: 'Target OEE (%)',
      availSlider: 'Availability (%)',
      perfSlider: 'Performance (%)',
      qualSlider: 'Quality (%)',
      calculatedOee: 'Simulated OEE',
      pillarsDefinitionTitle: 'Three Pillars of OEE',
      availDef: 'Scheduled operating time actually spent running, accounting for planned and unplanned stoppages.',
      perfDef: 'Actual throughput speed compared against nominal equipment cycle capacity.',
      qualDef: 'Conforming good units produced relative to total units started.',
      worldClass: 'World Class (>= 85%)',
      aboveTarget: 'Target Met',
      belowTarget: 'Below Target',
    },
    oeeView: {
      title: 'OEE & Pillar Analytics',
      subtitle: 'Monthly target attainment, pillar decomposition, polar radar comparison, bubble quadrant, and annual matrix.',
      targetChartTitle: 'Monthly OEE Target Attainment',
      pillarsChartTitle: 'OEE Pillars Breakdown vs Targets',
      radarTitle: 'Monthly Radar Profile (Meta vs Real)',
      bubbleTitle: 'Availability vs Performance Quadrant (Size = OEE)',
      heatmapTitle: 'Annual Component Intensity Matrix',
      modeGrouped: 'Grouped',
      modeStacked: 'Stacked',
      modeArea: 'Area Trend',
      selectMonth: 'Focus Month',
      editMonthly: 'Edit Monthly Values',
      closeEditor: 'Hide Editor',
      targetMet: 'Target Met',
      targetMissed: 'Below Target',
      targetLine: 'Target OEE',
    },
    consumosView: {
      title: 'Specific Input Consumption Trends',
      subtitle: 'Track utility and raw-material intensity across Planta A, B, and C over selectable date windows.',
      selectPlant: 'Plant',
      selectInput: 'Input / Utility',
      comparePlants: 'Compare All Plants',
      dateRange: 'Time Window',
      from: 'From',
      to: 'To',
      avgConsumption: 'Period Average',
      peakConsumption: 'Peak Value',
      minConsumption: 'Minimum Value',
      periodDelta: 'Window Change',
    },
    correlacaoView: {
      title: 'KPI Correlation & Regression',
      subtitle: 'Explore linear relationships between OEE and operational pillars with live Pearson r and multi-variable matrices.',
      xAxis: 'X-Axis Indicator',
      yAxis: 'Y-Axis Indicator',
      scatterTitle: 'Linear Scatter & OLS Regression',
      matrixTitle: 'Pearson Correlation Matrix',
      selectMatrixVars: 'Matrix Variables (2 to 4)',
      pearsonR: 'Pearson r',
      rSquared: 'R² Fit',
      regressionEq: 'Linear Fit',
      strongPos: 'Strong Positive',
      moderate: 'Moderate',
      weak: 'Weak / Independent',
      negative: 'Inverse Correlation',
    },
    heatmapView: {
      title: 'Equipment Performance Heatmap',
      subtitle: 'Compare production assets across OEE, Availability, Quality, and Performance to isolate bottlenecks.',
      selectVariables: 'Active KPI Columns',
      benchmarkTable: 'Asset Benchmark Ledger',
      equipment: 'Equipment',
      line: 'Production Cell',
      bottleneck: 'Needs Attention',
      nominal: 'Nominal',
    },
    paradasView: {
      title: 'Equipment Stoppage & Pareto Analysis',
      subtitle: 'Analyze downtime frequency, cumulative Pareto share, and estimated production minutes lost.',
      donutTitle: 'Stoppage Share by Cause',
      paretoTitle: 'Pareto Impact & Cumulative Share',
      totalStops: 'Total Stoppages',
      topCause: 'Primary Driver',
      estDowntime: 'Est. Lost Time',
      addCause: 'Add Stoppage Entry',
      causeName: 'Cause',
      stopsCount: 'Stops',
      avgMin: 'Avg Min/Stop',
      share: 'Share',
      cumulative: 'Cumulative',
    },
  },
  pt: {
    appTitle: 'Industrial Analytics',
    nav: {
      overview: 'Visão Geral & Simulador',
      oee: 'OEE & Pilares',
      consumos: 'Consumo de Insumos',
      correlacao: 'Matriz de Correlação',
      heatmap: 'Heatmap de Equipamentos',
      paradas: 'Pareto de Paradas',
    },
    actions: {
      themeStudio: 'Estúdio de Temas',
      resetData: 'Restaurar Dados',
      lightMode: 'Claro',
      darkMode: 'Escuro',
      exportSpec: 'Exportar Spec',
    },
    overview: {
      title: 'Desempenho Fabril & Simulador OEE',
      subtitle: 'Resumo executivo da Eficiência Global do Equipamento (OEE) com simulador interativo dos três pilares.',
      avgOee: 'OEE Médio Anual',
      availability: 'Disponibilidade',
      performance: 'Performance',
      quality: 'Qualidade',
      targetLabel: 'Meta',
      simulatorTitle: 'Simulador Dinâmico de Velocímetro OEE',
      simulatorDesc: 'Ajuste os três pilares do OEE ou a meta para avaliar a eficiência global em tempo real.',
      targetOeeSlider: 'Meta OEE (%)',
      availSlider: 'Disponibilidade (%)',
      perfSlider: 'Performance (%)',
      qualSlider: 'Qualidade (%)',
      calculatedOee: 'OEE Simulado',
      pillarsDefinitionTitle: 'Os Três Pilares do OEE',
      availDef: 'Tempo disponível em que a máquina realmente produziu, descontando paradas programadas e não programadas.',
      perfDef: 'Eficiência real de velocidade do equipamento comparada à capacidade nominal de ciclo.',
      qualDef: 'Proporção de produtos conformes produzidos em relação ao total iniciado.',
      worldClass: 'Classe Mundial (>= 85%)',
      aboveTarget: 'Meta Atingida',
      belowTarget: 'Abaixo da Meta',
    },
    oeeView: {
      title: 'Análise Detalhada de OEE & Pilares',
      subtitle: 'Acompanhamento de metas mensais, decomposição dos pilares, gráfico de radar, bolhas e matriz térmica anual.',
      targetChartTitle: 'Atingimento Mensal da Meta de OEE',
      pillarsChartTitle: 'Componentes do OEE vs Metas',
      radarTitle: 'Perfil de Radar Mensal (Meta vs Real)',
      bubbleTitle: 'Quadrante Disponibilidade vs Performance (Tamanho = OEE)',
      heatmapTitle: 'Matriz de Intensidade dos Componentes',
      modeGrouped: 'Agrupado',
      modeStacked: 'Empilhado',
      modeArea: 'Área',
      selectMonth: 'Mês em Foco',
      editMonthly: 'Editar Dados Mensais',
      closeEditor: 'Fechar Editor',
      targetMet: 'Meta Atingida',
      targetMissed: 'Abaixo da Meta',
      targetLine: 'Meta OEE',
    },
    consumosView: {
      title: 'Tendências de Consumo Específico',
      subtitle: 'Monitore o consumo específico de insumos nas Plantas A, B e C em intervalos de datas selecionáveis.',
      selectPlant: 'Planta',
      selectInput: 'Insumo',
      comparePlants: 'Comparar Todas as Plantas',
      dateRange: 'Período',
      from: 'De',
      to: 'Até',
      avgConsumption: 'Média do Período',
      peakConsumption: 'Pico Máximo',
      minConsumption: 'Valor Mínimo',
      periodDelta: 'Variação no Período',
    },
    correlacaoView: {
      title: 'Correlação & Regressão de KPIs',
      subtitle: 'Explore relações lineares entre OEE e indicadores operacionais com Pearson r em tempo real e matriz de correlação.',
      xAxis: 'Indicador Eixo X',
      yAxis: 'Indicador Eixo Y',
      scatterTitle: 'Dispersão & Regressão Linear',
      matrixTitle: 'Matriz de Correlação de Pearson',
      selectMatrixVars: 'Variáveis da Matriz (2 a 4)',
      pearsonR: 'Pearson r',
      rSquared: 'Ajuste R²',
      regressionEq: 'Equação Linear',
      strongPos: 'Correlação Positiva Forte',
      moderate: 'Moderada',
      weak: 'Fraca / Independente',
      negative: 'Correlação Inversa',
    },
    heatmapView: {
      title: 'Heatmap de KPIs por Equipamento',
      subtitle: 'Compare os equipamentos produtivos em OEE, Disponibilidade, Qualidade e Performance para isolar gargalos.',
      selectVariables: 'Colunas de KPI Ativas',
      benchmarkTable: 'Tabela Comparativa por Ativo',
      equipment: 'Equipamento',
      line: 'Célula Produtiva',
      bottleneck: 'Ponto de Atenção',
      nominal: 'Nominal',
    },
    paradasView: {
      title: 'Distribuição & Pareto de Paradas',
      subtitle: 'Analise a frequência de causas de parada, impacto acumulado de Pareto e tempo estimado perdido.',
      donutTitle: 'Participação por Causa de Parada',
      paretoTitle: 'Impacto Pareto & % Acumulada',
      totalStops: 'Total de Paradas',
      topCause: 'Causa Principal',
      estDowntime: 'Tempo Perdido Est.',
      addCause: 'Adicionar Registro',
      causeName: 'Causa',
      stopsCount: 'Paradas',
      avgMin: 'Min Méd./Parada',
      share: 'Participação',
      cumulative: 'Acumulado',
    },
  },
};
