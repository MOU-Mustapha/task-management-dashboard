import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Statistic } from '../../models/statistics.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-card',
  imports: [CommonModule],
  templateUrl: './statistics-card.html',
  styleUrl: './statistics-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCard {
  @Input({ required: true }) statistic!: Statistic;
  get formattedChange(): string {
    if (Number(this.statistic.change) == 0) return '';
    return this.statistic.change;
  }
}
