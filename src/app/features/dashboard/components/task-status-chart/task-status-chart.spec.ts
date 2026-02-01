import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { DonutChartData } from '../../models/statistics.model';
import { TaskStatusChart } from './task-status-chart';

vi.mock('chart.js/auto', () => {
  const mockChart = {
    data: {
      datasets: [{ data: [0, 0, 0] }],
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

describe('TaskStatusChart', () => {
  let component: TaskStatusChart;
  let fixture: ComponentFixture<TaskStatusChart>;
  let chartMock: {
    mockClear: () => void;
    mock: {
      calls: [HTMLCanvasElement, ChartConfiguration][];
      results: Array<{ value: unknown }>;
    };
    (canvas: HTMLCanvasElement, config: ChartConfiguration): unknown;
  };

  const baseData: DonutChartData = {
    completed: 7,
    inProgress: 3,
    overdue: 1,
  };

  beforeEach(async () => {
    chartMock = Chart as unknown as typeof chartMock;
    chartMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        TaskStatusChart,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatusChart);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.chartData = baseData;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should create Chart on first render with correct data and options', async () => {
    component.chartData = baseData;
    fixture.detectChanges();

    // Wait for the async import in ngAfterViewInit
    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    const [canvasEl, config] = chartMock.mock.calls[0];

    expect(canvasEl).toBe(fixture.debugElement.nativeElement.querySelector('canvas'));

    expect(config.type).toBe('pie');
    expect(config.data?.labels).toEqual(['Completed', 'In Progress', 'Overdue']);
    expect(config.data?.datasets).toEqual([
      {
        data: [7, 3, 1],
        backgroundColor: ['#388E3C', '#FF6F00', '#D32F2F'],
      },
    ]);

    expect(config.options).toEqual({
      cutout: '0%',
      plugins: { legend: { position: 'bottom' } },
    });
  });

  it('should update existing Chart when ngAfterViewInit runs again', async () => {
    component.chartData = baseData;
    fixture.detectChanges();

    // Initialize the chart first
    await component.ngAfterViewInit();

    component.chartData = {
      completed: 1,
      inProgress: 2,
      overdue: 3,
    };

    // Mock the chart instance to avoid DOM issues during update
    const chartInstance = (component as unknown as { chart: Chart }).chart;
    chartInstance.update = vi.fn();

    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    expect(chartInstance.data.datasets[0].data).toEqual([1, 2, 3]);
    expect(chartInstance.update).toHaveBeenCalledTimes(1);
  });
});
