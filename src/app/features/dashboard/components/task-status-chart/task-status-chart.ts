import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DonutChartData } from '../../models/statistics.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-status-chart',
  imports: [TranslateModule],
  templateUrl: './task-status-chart.html',
  styleUrl: './task-status-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatusChart implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) chartData!: DonutChartData;
  private chart!: Chart;
  ngAfterViewInit(): void {
    if (!this.chart) {
      this.chart = new Chart(this.canvas.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Completed', 'In Progress', 'Overdue'],
          datasets: [
            {
              data: [this.chartData.completed, this.chartData.inProgress, this.chartData.overdue],
              backgroundColor: ['#388E3C', '#FF6F00', '#D32F2F'],
            },
          ],
        },
        options: {
          cutout: '0%',
          plugins: { legend: { position: 'bottom' } },
        },
      });
    } else {
      this.chart.data.datasets[0].data = [
        this.chartData.completed,
        this.chartData.inProgress,
        this.chartData.overdue,
      ];
      this.chart.update();
    }
  }
}
