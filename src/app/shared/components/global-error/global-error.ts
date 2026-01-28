import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ErrorService } from '../../../core/services/error/error.service';

@Component({
  selector: 'app-global-error',
  imports: [DialogModule, ButtonModule],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
})
export class GlobalError {
  public readonly errorService = inject(ErrorService);
  close() {
    this.errorService.clear();
  }
}
