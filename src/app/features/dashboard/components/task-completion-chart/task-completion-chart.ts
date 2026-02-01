import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { BarChartData } from '../../models/statistics.model';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Task Completion Chart Component
 *
 * Responsibilities:
 * - Renders a horizontal stacked bar chart to visualize task completion.
 * - Displays "Completed" vs "Remaining" tasks using Chart.js.
 * - Updates chart dynamically if input `chartData` changes.
 *
 * Inputs:
 * - `chartData` (BarChartData): Required data object.
 *
 * Lifecycle:
 * - Implements AfterViewInit to initialize the Chart.js instance.
 * - Updates existing chart data if the component is re-rendered.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-completion-chart',
  imports: [TranslateModule],
  templateUrl: './task-completion-chart.html',
  styleUrl: './task-completion-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCompletionChart implements AfterViewInit {
  @Input({ required: true }) chartData!: BarChartData;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chart!: any;
  async ngAfterViewInit(): Promise<void> {
    if (!this.chart) {
      const { Chart } = await import('chart.js/auto');
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Tasks'],
          datasets: [
            { label: 'Completed', data: [this.chartData.completed], backgroundColor: '#388E3C' },
            { label: 'Remaining', data: [this.chartData.remaining], backgroundColor: '#E0E0E0' },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          scales: { x: { stacked: true }, y: { stacked: true } },
        },
      });
    } else {
      this.chart.data.datasets[0].data = [this.chartData.completed];
      this.chart.data.datasets[1].data = [this.chartData.remaining];
      this.chart.update();
    }
  }
}
