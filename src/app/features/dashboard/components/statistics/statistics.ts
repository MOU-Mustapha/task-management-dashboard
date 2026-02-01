import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Statistic } from '../../models/statistics.model';
import { StatisticsCard } from '../statistics-card/statistics-card';

/**
 * Statistics Component
 *
 * Responsibilities:
 * - Acts as a presentational component for displaying a list of statistics.
 * - Uses the `StatisticsCard` component to render individual statistic items.
 *
 * Inputs:
 * - `statistics` (Statistic[]): Required array of statistics to display.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
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
