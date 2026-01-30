import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogModule, TranslateModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  @Input({ required: true }) visible: boolean = false;
  @Input({ required: true }) message: string = '';
  @Output() dismiss = new EventEmitter();
  @Output() confirm = new EventEmitter();
  confirmDialog() {
    this.confirm.emit();
    this.hideDialog();
  }
  hideDialog() {
    this.dismiss.emit();
    this.visible = false;
  }
}
