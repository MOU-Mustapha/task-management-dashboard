import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Statistics } from '../../components/statistics/statistics';
import { DashboardFacade } from '../../services/dashboard.facade';
import { TaskStatusChart } from '../../components/task-status-chart/task-status-chart';
import { TaskCompletionChart } from '../../components/task-completion-chart/task-completion-chart';
import { TaskWeeklyChangeChart } from '../../components/task-weekly-change-chart/task-weekly-change-chart';
import { TaskRiskChart } from '../../components/task-risk-chart/task-risk-chart';

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
