import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Presentational component to display a single field error message.
 *
 * Responsibilities:
 * - Shows an error message when `displayError` is true
 * - Supports translation via `TranslateModule`
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 *
 * Usage:
 * <app-field-error
 *   [errorMsg]="'RequiredFieldError' | translate"
 *   [displayError]="isFieldInvalid"
 * />
 */
@Component({
  selector: 'app-field-error',
  imports: [TranslateModule],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldError {
  @Input({ required: true }) errorMsg!: string;
  @Input({ required: true }) displayError!: boolean;
}
