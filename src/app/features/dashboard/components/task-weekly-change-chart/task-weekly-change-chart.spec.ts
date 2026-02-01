import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { weeklyChangesChartData } from '../../models/statistics.model';
import { TaskWeeklyChangeChart } from './task-weekly-change-chart';

vi.mock('chart.js/auto', () => {
  const mockChart = {
    data: {
      labels: [],
      datasets: [{ data: [] }],
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

describe('TaskWeeklyChangeChart', () => {
  let component: TaskWeeklyChangeChart;
  let fixture: ComponentFixture<TaskWeeklyChangeChart>;
  let chartMock: {
    mockClear: () => void;
    mock: {
      calls: [HTMLCanvasElement, ChartConfiguration][];
      results: Array<{ value: unknown }>;
    };
    (canvas: HTMLCanvasElement, config: ChartConfiguration): unknown;
  };

  const baseData: weeklyChangesChartData[] = [
    { label: 'A', value: 10, type: 'positive' },
    { label: 'B', value: -5, type: 'negative' },
    { label: 'C', value: 0, type: 'neutral' },
  ];

  beforeEach(async () => {
    chartMock = Chart as unknown as typeof chartMock;
    chartMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        TaskWeeklyChangeChart,
        TranslateModule.forRoot({
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskWeeklyChangeChart);
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

    expect(config.type).toBe('bar');
    expect(config.data?.labels).toEqual(['A', 'B', 'C']);
    expect(config.data?.datasets).toEqual([
      {
        label: '',
        data: [10, -5, 0],
        backgroundColor: ['#388E3C', '#D32F2F', '#9E9E9E'],
      },
    ]);
    expect(config.options).toEqual({
      indexAxis: 'y',
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } },
    });
  });

  it('should update existing Chart when ngAfterViewInit runs again', async () => {
    component.chartData = baseData;
    fixture.detectChanges();

    // Initialize the chart first
    await component.ngAfterViewInit();

    component.chartData = [
      { label: 'X', value: 1, type: 'positive' },
      { label: 'Y', value: 2, type: 'negative' },
    ];

    // Mock the chart instance to avoid DOM issues during update
    const chartInstance = (component as unknown as { chart: Chart }).chart;
    chartInstance.update = vi.fn();

    await component.ngAfterViewInit();

    expect(chartMock).toHaveBeenCalledTimes(1);

    expect(chartInstance.data.labels).toEqual(['X', 'Y']);
    expect(chartInstance.data.datasets[0].data).toEqual([1, 2]);
    expect(chartInstance.update).toHaveBeenCalledTimes(1);
  });
});
