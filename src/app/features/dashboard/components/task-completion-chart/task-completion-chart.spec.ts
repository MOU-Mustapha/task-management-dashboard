import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { BarChartData } from '../../models/statistics.model';
import { TaskCompletionChart } from './task-completion-chart';

vi.mock('chart.js/auto', () => {
  const mockChart = {
    data: {
      datasets: [{ data: [] }, { data: [] }],
    },
    update: vi.fn(),
  };
  return {
    Chart: vi.fn().mockImplementation(function () {
      return mockChart;
    }),
  };
});

import { Chart } from 'chart.js/auto';

describe('TaskCompletionChart', () => {
  let component: TaskCompletionChart;
  let fixture: ComponentFixture<TaskCompletionChart>;
  type ChartConfigLike = {
    type: string;
    data: {
      labels: string[];
      datasets: Array<{ label: string; data: number[]; backgroundColor: string }>;
    };
    options: {
      indexAxis: 'y' | 'x';
      responsive: boolean;
      scales: { x: { stacked: boolean }; y: { stacked: boolean } };
    };
  };

  let chartMock: typeof Chart & { mockClear: () => void; mock: { calls: unknown[][] } };

  const baseData: BarChartData = {
    completed: 7,
    remaining: 3,
  };

  beforeEach(async () => {
    chartMock = Chart as typeof Chart & { mockClear: () => void; mock: { calls: unknown[][] } };
    chartMock.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        TaskCompletionChart,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCompletionChart);
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

    const [canvasEl, config] = chartMock.mock.calls[0] as [HTMLCanvasElement, ChartConfigLike];
    expect(canvasEl).toBe(fixture.debugElement.nativeElement.querySelector('canvas'));

    expect(config.type).toBe('bar');
    expect(config.data.labels).toEqual(['Tasks']);
    expect(config.data.datasets).toEqual([
      { label: 'Completed', data: [7], backgroundColor: '#388E3C' },
      { label: 'Remaining', data: [3], backgroundColor: '#E0E0E0' },
    ]);
    expect(config.options).toEqual({
      indexAxis: 'y',
      responsive: true,
      scales: { x: { stacked: true }, y: { stacked: true } },
    });
  });
});
