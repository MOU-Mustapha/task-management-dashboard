import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GlobalErrorObject } from '../../models/error.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-global-error',
  imports: [DialogModule, ButtonModule, TranslateModule],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalError {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  readonly error = signal<GlobalErrorObject>(this.dialogConfig.data.error);
  close() {
    this.dialogRef.close();
  }
}
