import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type {
  BarChartData,
  DonutChartData,
  weeklyChangesChartData,
} from '../../models/statistics.model';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardPage } from './dashboard-page';

@Component({
  selector: 'app-statistics',
  standalone: true,
  template: '',
})
class StatisticsStub {
  @Input({ required: true }) statistics!: unknown[];
}

@Component({
  selector: 'app-task-status-chart',
  standalone: true,
  template: '',
})
class TaskStatusChartStub {
  @Input({ required: true }) chartData!: DonutChartData;
}

@Component({
  selector: 'app-task-completion-chart',
  standalone: true,
  template: '',
})
class TaskCompletionChartStub {
  @Input({ required: true }) chartData!: BarChartData;
}

@Component({
  selector: 'app-task-weekly-change-chart',
  standalone: true,
  template: '',
})
class TaskWeeklyChangeChartStub {
  @Input({ required: true }) chartData!: weeklyChangesChartData[];
}

@Component({
  selector: 'app-task-risk-chart',
  standalone: true,
  template: '',
})
class TaskRiskChartStub {
  @Input({ required: true }) overdueRatio!: number;
}

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let facadeMock: {
    statistics: ReturnType<typeof vi.fn>;
    totalTasks: ReturnType<typeof vi.fn>;
    taskStatusChartData: ReturnType<typeof vi.fn>;
    completionChartData: ReturnType<typeof vi.fn>;
    weeklyChanges: ReturnType<typeof vi.fn>;
    overdueRatio: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    facadeMock = {
      statistics: vi.fn(() => []),
      totalTasks: vi.fn(() => 0),
      taskStatusChartData: vi.fn(() => ({ completed: 0, inProgress: 0, overdue: 0 })),
      completionChartData: vi.fn(() => ({ completed: 0, remaining: 0 })),
      weeklyChanges: vi.fn(() => []),
      overdueRatio: vi.fn(() => 0),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [{ provide: DashboardFacade, useValue: facadeMock }],
    })
      .overrideComponent(DashboardPage, {
        set: {
          imports: [
            StatisticsStub,
            TaskStatusChartStub,
            TaskCompletionChartStub,
            TaskWeeklyChangeChartStub,
            TaskRiskChartStub,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should always render statistics', () => {
    facadeMock.statistics.mockReturnValue([{ id: 'x' }]);

    fixture.detectChanges();

    const statsEl = fixture.debugElement.query(By.css('app-statistics'));
    expect(statsEl).toBeTruthy();

    const statsCmp = statsEl.componentInstance as StatisticsStub;
    expect(statsCmp.statistics).toEqual([{ id: 'x' }]);
  });

  it('should not render charts when totalTasks is 0', () => {
    facadeMock.totalTasks.mockReturnValue(0);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-task-status-chart'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-task-completion-chart'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-task-weekly-change-chart'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-task-risk-chart'))).toBeNull();
  });

  it('should render charts and bind inputs when totalTasks is > 0', () => {
    facadeMock.totalTasks.mockReturnValue(10);

    const statusData: DonutChartData = { completed: 7, inProgress: 2, overdue: 1 };
    const completionData: BarChartData = { completed: 7, remaining: 3 };
    const weeklyData: weeklyChangesChartData[] = [
      { label: 'Tasks Created', value: 5, type: 'positive' },
      { label: 'Tasks Completed', value: 2, type: 'positive' },
      { label: 'Net Growth', value: 3, type: 'negative' },
    ];

    facadeMock.taskStatusChartData.mockReturnValue(statusData);
    facadeMock.completionChartData.mockReturnValue(completionData);
    facadeMock.weeklyChanges.mockReturnValue(weeklyData);
    facadeMock.overdueRatio.mockReturnValue(10);

    fixture.detectChanges();

    const statusEl = fixture.debugElement.query(By.css('app-task-status-chart'));
    const completionEl = fixture.debugElement.query(By.css('app-task-completion-chart'));
    const weeklyEl = fixture.debugElement.query(By.css('app-task-weekly-change-chart'));
    const riskEl = fixture.debugElement.query(By.css('app-task-risk-chart'));

    expect(statusEl).toBeTruthy();
    expect(completionEl).toBeTruthy();
    expect(weeklyEl).toBeTruthy();
    expect(riskEl).toBeTruthy();

    expect((statusEl.componentInstance as TaskStatusChartStub).chartData).toEqual(statusData);
    expect((completionEl.componentInstance as TaskCompletionChartStub).chartData).toEqual(
      completionData,
    );
    expect((weeklyEl.componentInstance as TaskWeeklyChangeChartStub).chartData).toEqual(weeklyData);
    expect((riskEl.componentInstance as TaskRiskChartStub).overdueRatio).toBe(10);
  });
});
