import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TaskRiskChart } from './task-risk-chart';

vi.mock('chart.js/auto', () => {
  const mockChart = {
    data: {
      datasets: [{ data: [0, 0] }],
    },
    update: vi.fn(),
  };
  return {
    Chart: vi.fn().mockImplementation(function () {
      return mockChart;
    }),
  };
});

import { Chart, ChartConfiguration } from 'chart.js/auto';

describe('TaskRiskChart', () => {
  let component: TaskRiskChart;
  let fixture: ComponentFixture<TaskRiskChart>;
  let chartMock: {
    mockClear: () => void;
    mock: { calls: [HTMLCanvasElement, ChartConfiguration][] };
    (canvas: HTMLCanvasElement, config: ChartConfiguration): unknown;
  };

  const baseOverdueRatio = 25;

  beforeEach(async () => {
    chartMock = Chart as unknown as typeof chartMock;
    chartMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        TaskRiskChart,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskRiskChart);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create Chart on first render with correct data and options', () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [canvasEl, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfiguration];
    expect(canvasEl).toBe(fixture.debugElement.nativeElement.querySelector('canvas'));

    expect(config.type).toBe('doughnut');
    expect(config.data.labels).toEqual(['Overdue Percentage', 'Others Percentage']);
    expect(config.data.datasets).toEqual([
      {
        data: [25, 75],
        backgroundColor: ['#D32F2F', '#E0E0E0'],
      },
    ]);
    expect(config.options).toEqual({
      plugins: { legend: { display: false } },
    });
  });

  it('should handle zero overdue ratio', () => {
    component.overdueRatio = 0;
    fixture.detectChanges();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfiguration];
    expect(config.data.datasets[0].data).toEqual([0, 100]);
  });

  it('should handle 100% overdue ratio', () => {
    component.overdueRatio = 100;
    fixture.detectChanges();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfiguration];
    expect(config.data.datasets[0].data).toEqual([100, 0]);
  });

  it('should handle decimal overdue ratios', () => {
    component.overdueRatio = 33.33;
    fixture.detectChanges();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfiguration];
    expect(config.data.datasets[0].data).toEqual([33.33, 66.67]);
  });

  it('should have correct chart configuration for risk visualization', () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    const [, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfiguration];

    // Verify it's a doughnut chart (appropriate for risk visualization)
    expect(config.type).toBe('doughnut');

    // Verify colors are appropriate for risk (red for overdue, gray for others)
    expect(config.data.datasets[0].backgroundColor).toEqual(['#D32F2F', '#E0E0E0']);

    // Verify legend is disabled (cleaner look for doughnut chart)
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });
});
