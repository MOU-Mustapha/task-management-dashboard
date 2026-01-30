import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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
