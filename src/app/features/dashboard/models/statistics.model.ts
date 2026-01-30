export type ChangeType = 'positive' | 'negative' | 'neutral';

export interface Statistic {
  id: string;
  title: string;
  icon: string;
  value: number;
  change: string;
  changeLabel: string;
  changeType: ChangeType;
  color: string;
}

export interface DonutChartData {
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface BarChartData {
  completed: number;
  remaining: number;
}
export interface weeklyChangesChartData {
  label: string;
  value: number;
  type: string;
}
