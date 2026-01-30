import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-task-risk-chart',
  imports: [],
  templateUrl: './task-risk-chart.html',
  styleUrl: './task-risk-chart.scss',
})
export class TaskRiskChart implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) overdueRatio!: number;
  private chart!: Chart;
  ngAfterViewInit(): void {
    if (!this.chart) {
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
