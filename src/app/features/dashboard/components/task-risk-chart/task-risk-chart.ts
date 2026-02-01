import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Task Risk Chart Component
 *
 * Responsibilities:
 * - Renders a donut chart showing the percentage of overdue tasks.
 * - Visualizes the overdue ratio vs total tasks.
 * - Updates dynamically if the input `overdueRatio` changes.
 *
 * Inputs:
 * - `overdueRatio` (number): Required percentage of overdue tasks.
 *
 * Lifecycle:
 * - Implements AfterViewInit to initialize the Chart.js instance.
 * - Updates existing chart data if the component is re-rendered.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-risk-chart',
  imports: [TranslateModule],
  templateUrl: './task-risk-chart.html',
  styleUrl: './task-risk-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskRiskChart implements AfterViewInit {
  @Input({ required: true }) overdueRatio!: number;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chart!: any;
  async ngAfterViewInit(): Promise<void> {
    if (!this.chart) {
      const { Chart } = await import('chart.js/auto');
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Overdue Percentage', 'Others Percentage'],
          datasets: [
            {
              data: [this.overdueRatio, 100 - this.overdueRatio],
              backgroundColor: ['#D32F2F', '#E0E0E0'],
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
        },
      });
    } else {
      this.chart.data.datasets[0].data = [this.overdueRatio, 100 - this.overdueRatio];
      this.chart.update();
    }
  }
}
