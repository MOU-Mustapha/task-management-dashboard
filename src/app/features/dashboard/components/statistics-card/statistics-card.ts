import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Statistic } from '../../models/statistics.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Statistics Card Component
 *
 * Responsibilities:
 * - Displays a single statistic in a card layout.
 *
 * Inputs:
 * - `statistic` (Statistic): Required statistic object.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-statistics-card',
  imports: [CommonModule, TranslateModule],
  templateUrl: './statistics-card.html',
  styleUrl: './statistics-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCard {
  @Input({ required: true }) statistic!: Statistic;
  /**
   * Returns a formatted string for the change value.
   * Hides the change if it is zero.
   */
  get formattedChange(): string {
    if (Number(this.statistic.change) == 0) return '';
    return this.statistic.change;
  }
}
