import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BarChartData } from '../../models/statistics.model';

@Component({
  selector: 'app-task-completion-chart',
  imports: [],
  templateUrl: './task-completion-chart.html',
  styleUrl: './task-completion-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCompletionChart implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) chartData!: BarChartData;
  private chart!: Chart;
  ngAfterViewInit(): void {
    if (!this.chart) {
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
