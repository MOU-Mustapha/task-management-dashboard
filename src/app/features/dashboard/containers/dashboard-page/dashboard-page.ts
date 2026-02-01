import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Statistics } from '../../components/statistics/statistics';
import { DashboardFacade } from '../../services/dashboard.facade';
import { TaskStatusChart } from '../../components/task-status-chart/task-status-chart';
import { TaskCompletionChart } from '../../components/task-completion-chart/task-completion-chart';
import { TaskWeeklyChangeChart } from '../../components/task-weekly-change-chart/task-weekly-change-chart';
import { TaskRiskChart } from '../../components/task-risk-chart/task-risk-chart';

/**
 * Dashboard Page Component
 *
 * Responsibilities:
 * - Serves as the main dashboard page.
 * - Displays statistics cards, task status, completion, weekly changes, and risk charts.
 *
 * Composition:
 * - <app-statistics>: Displays task metrics as cards (total, completed, in progress, overdue).
 * - <app-task-status-chart>: chart showing task status distribution.
 * - <app-task-completion-chart>: chart showing completed vs remaining tasks.
 * - <app-task-weekly-change-chart>: chart showing weekly task changes.
 * - <app-task-risk-chart>: chart showing the overdue task ratio.
 *
 * Data Flow:
 * - All chart data is derived from DashboardFacade computed properties.
 * - Charts are displayed only if there is at least one task (`totalTasks > 0`).
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-dashboard-page',
  imports: [Statistics, TaskStatusChart, TaskCompletionChart, TaskWeeklyChangeChart, TaskRiskChart],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  public readonly dashboardFacade = inject(DashboardFacade);
}
