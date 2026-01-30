import { computed, inject, Injectable } from '@angular/core';
import { DashboardApiService } from './dashboard.api.service';
import { BarChartData, DonutChartData, weeklyChangesChartData } from '../models/statistics.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  private readonly dashboardApi = inject(DashboardApiService);
  // Data Source
  readonly statistics = computed(() => this.dashboardApi.statisticsResource.value() ?? []);
  // Derived State
  readonly totalTasks = computed(
    () => this.statistics().find((s) => s.id === 'stat-001')?.value ?? 0,
  );
  readonly completedTasks = computed(
    () => this.statistics().find((s) => s.id === 'stat-002')?.value ?? 0,
  );
  readonly inProgressTasks = computed(
    () => this.statistics().find((s) => s.id === 'stat-003')?.value ?? 0,
  );
  readonly overdueTasks = computed(
    () => this.statistics().find((s) => s.id === 'stat-004')?.value ?? 0,
  );
  // Donut chart model
  readonly taskStatusChartData = computed<DonutChartData>(() => ({
    completed: this.completedTasks(),
    inProgress: this.inProgressTasks(),
    overdue: this.overdueTasks(),
  }));
  // Progress Percentage
  readonly completionChartData = computed<BarChartData>(() => ({
    completed: this.completedTasks(),
    remaining: Math.max(this.totalTasks() - this.completedTasks(), 0),
  }));
  // Weekly change bar chart
  readonly weeklyChanges = computed<weeklyChangesChartData[]>(() => {
    const totalChange = Number(this.statistics().find((x) => x.id === 'stat-001')?.change ?? 0);
    const completedChange = Number(this.statistics().find((s) => s.id === 'stat-002')?.change ?? 0);
    return [
      { label: 'Tasks Created', value: totalChange, type: 'positive' },
      { label: 'Tasks Completed', value: completedChange, type: 'positive' },
      {
        label: 'Net Growth',
        value: totalChange - completedChange,
        type: totalChange > completedChange ? 'negative' : 'positive',
      },
    ];
  });
  // Risk indicator
  readonly overdueRatio = computed(() => {
    const total = this.totalTasks();
    return total ? Math.round((this.overdueTasks() / total) * 100) : 0;
  });
}
