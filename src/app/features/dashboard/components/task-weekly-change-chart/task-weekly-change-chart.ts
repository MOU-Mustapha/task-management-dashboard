import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { weeklyChangesChartData } from '../../models/statistics.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * TaskWeeklyChangeChart Component
 *
 * Responsibilities:
 * - Renders a horizontal bar chart to visualize weekly changes in task metrics.
 * - Supports dynamic coloring of bars based on type.
 * - Updates dynamically if the input `chartData` changes.
 *
 * Inputs:
 * - `chartData` (weeklyChangesChartData[]): Required array.
 *
 * Lifecycle:
 * - Implements AfterViewInit to initialize Chart.js instance.
 * - Updates chart data dynamically when component is re-rendered.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-weekly-change-chart',
  imports: [TranslateModule],
  templateUrl: './task-weekly-change-chart.html',
  styleUrl: './task-weekly-change-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskWeeklyChangeChart implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) chartData!: weeklyChangesChartData[];
  private chart!: Chart;
  ngAfterViewInit(): void {
    if (!this.chart) {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.chartData.map((x) => x.label),
          datasets: [
            {
              label: '',
              data: this.chartData.map((x) => x.value),
              backgroundColor: this.chartData.map((x) =>
                x.type === 'positive' ? '#388E3C' : x.type === 'negative' ? '#D32F2F' : '#9E9E9E',
              ),
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          scales: { x: { stacked: true }, y: { stacked: true } },
        },
      });
    } else {
      this.chart.data.labels = this.chartData.map((d) => d.label);
      this.chart.data.datasets[0].data = this.chartData.map((d) => d.value);
      this.chart.update();
    }
  }
}
