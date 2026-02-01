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
          fallbackLang: 'en',
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

  it('should create Chart on first render with correct data and options', async () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [canvasEl, config] = chartMock.mock.calls[0];
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

  it('should handle zero overdue ratio', async () => {
    component.overdueRatio = 0;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0];
    expect(config.data.datasets[0].data).toEqual([0, 100]);
  });

  it('should handle 100% overdue ratio', async () => {
    component.overdueRatio = 100;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0];
    expect(config.data.datasets[0].data).toEqual([100, 0]);
  });

  it('should handle decimal overdue ratios', async () => {
    component.overdueRatio = 33.33;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [, config] = chartMock.mock.calls[0];
    expect(config.data.datasets[0].data).toEqual([33.33, 66.67]);
  });

  it('should have correct chart configuration for risk visualization', async () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    const [, config] = chartMock.mock.calls[0];

    // Verify it's a doughnut chart (appropriate for risk visualization)
    expect(config.type).toBe('doughnut');

    // Verify colors are appropriate for risk (red for overdue, gray for others)
    expect(config.data.datasets[0].backgroundColor).toEqual(['#D32F2F', '#E0E0E0']);

    // Verify legend is disabled (cleaner look for doughnut chart)
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });

  it('should update existing Chart when ngAfterViewInit runs again', async () => {
    component.overdueRatio = baseOverdueRatio;
    fixture.detectChanges();

    // Initialize the chart first
    await component.ngAfterViewInit();

    // Change the data
    component.overdueRatio = 50;

    // Mock the chart instance to avoid DOM issues during update
    const chartInstance = (component as unknown as { chart: Chart }).chart;
    chartInstance.update = vi.fn();

    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);
    expect(chartInstance.data.datasets[0].data).toEqual([50, 50]);
    expect(chartInstance.update).toHaveBeenCalledTimes(1);
  });
});
