import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

import { Statistic } from '../models/statistics.model';
import { DashboardApiService } from './dashboard.api.service';
import { DashboardFacade } from './dashboard.facade';

describe('DashboardFacade', () => {
  let facade: DashboardFacade;
  let dashboardApiMock: {
    statisticsResource: {
      value: Mock;
    };
  };

  let statistics: Statistic[] | undefined;

  beforeEach(() => {
    statistics = undefined;

    dashboardApiMock = {
      statisticsResource: {
        value: vi.fn(() => statistics),
      },
    };

    TestBed.configureTestingModule({
      providers: [DashboardFacade, { provide: DashboardApiService, useValue: dashboardApiMock }],
    });

    facade = TestBed.inject(DashboardFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('statistics should default to empty array when resource value is undefined', () => {
    statistics = undefined;

    expect(facade.statistics()).toEqual([]);
  });

  it('should compute task counts from statistics by id', () => {
    statistics = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '',
        value: 10,
        change: '2',
        changeLabel: 'from last week',
        changeType: 'positive',
        color: '',
      },
      {
        id: 'stat-002',
        title: 'Completed Tasks',
        icon: '',
        value: 7,
        change: '1',
        changeLabel: 'from last week',
        changeType: 'positive',
        color: '',
      },
      {
        id: 'stat-003',
        title: 'In Progress Tasks',
        icon: '',
        value: 2,
        change: '0',
        changeLabel: 'from last week',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-004',
        title: 'Overdue Tasks',
        icon: '',
        value: 1,
        change: '0',
        changeLabel: 'from last week',
        changeType: 'neutral',
        color: '',
      },
    ];

    expect(facade.totalTasks()).toBe(10);
    expect(facade.completedTasks()).toBe(7);
    expect(facade.inProgressTasks()).toBe(2);
    expect(facade.overdueTasks()).toBe(1);
  });

  it('completionChartData should compute remaining as non-negative', () => {
    statistics = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '',
        value: 3,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-002',
        title: 'Completed Tasks',
        icon: '',
        value: 5,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
    ];

    expect(facade.completionChartData()).toEqual({
      completed: 5,
      remaining: 0,
    });
  });

  it('taskStatusChartData should reflect derived counts', () => {
    statistics = [
      {
        id: 'stat-002',
        title: 'Completed Tasks',
        icon: '',
        value: 4,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-003',
        title: 'In Progress Tasks',
        icon: '',
        value: 3,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-004',
        title: 'Overdue Tasks',
        icon: '',
        value: 1,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
    ];

    expect(facade.taskStatusChartData()).toEqual({
      completed: 4,
      inProgress: 3,
      overdue: 1,
    });
  });

  it('weeklyChanges should compute net growth and type', () => {
    statistics = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '',
        value: 0,
        change: '5',
        changeLabel: '',
        changeType: 'positive',
        color: '',
      },
      {
        id: 'stat-002',
        title: 'Completed Tasks',
        icon: '',
        value: 0,
        change: '2',
        changeLabel: '',
        changeType: 'positive',
        color: '',
      },
    ];

    expect(facade.weeklyChanges()).toEqual([
      { label: 'Tasks Created', value: 5, type: 'positive' },
      { label: 'Tasks Completed', value: 2, type: 'positive' },
      { label: 'Net Growth', value: 3, type: 'negative' },
    ]);
  });

  it('overdueRatio should be 0 when total is 0', () => {
    statistics = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '',
        value: 0,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-004',
        title: 'Overdue Tasks',
        icon: '',
        value: 10,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
    ];

    expect(facade.overdueRatio()).toBe(0);
  });

  it('overdueRatio should compute rounded percentage when total > 0', () => {
    statistics = [
      {
        id: 'stat-001',
        title: 'Total Tasks',
        icon: '',
        value: 3,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
      {
        id: 'stat-004',
        title: 'Overdue Tasks',
        icon: '',
        value: 2,
        change: '0',
        changeLabel: '',
        changeType: 'neutral',
        color: '',
      },
    ];

    expect(facade.overdueRatio()).toBe(67);
  });
});
