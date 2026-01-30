import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Statistic } from '../../models/statistics.model';
import { StatisticsCard } from '../statistics-card/statistics-card';

@Component({
  selector: 'app-statistics',
  imports: [StatisticsCard],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics {
  @Input({ required: true }) statistics!: Statistic[];
}
