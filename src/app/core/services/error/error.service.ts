import { inject, Injectable } from '@angular/core';
import { GlobalErrorObject } from '../../../shared/models/error.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { GlobalError } from '../../../shared/components/global-error/global-error';
import { TranslateService } from '@ngx-translate/core';

/**
 * Centralized error handling service.
 *
 * Responsibilities:
 * - Normalizes and localizes error messages
 * - Displays a global error dialog using PrimeNG DynamicDialog
 * - Exposes an Observable that emits when the dialog is closed
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  /**
   * Displays a global error dialog.
   *
   * - Ensures the error message is a valid string
   * - Falls back to a translated generic error message if missing
   * - Opens a modal dialog and emits the result when it closes
   *
   * @param error Error object to display
   * @returns Observable that emits once when the dialog is closed
   */
  show(error: GlobalErrorObject): Observable<GlobalErrorObject | undefined> {
    if (typeof error.message !== 'string' || !error.message) {
      // Fallback to a generic translated error message
      error.message = this.translateService.instant('GeneralErrorMsg');
    }
    const ref = this.dialogService.open(GlobalError, {
      header: 'Error',
      width: '30%',
      height: 'fit-content',
      draggable: false,
      data: { error },
      closable: true,
      modal: true,
      breakpoints: {
        '1300px': '40%',
        '1024px': '70%',
        '768px': '90%',
        '560px': '95%',
      },
    });
    return new Observable((subscriber) => {
      if (ref)
        ref.onClose.subscribe((result?: GlobalErrorObject) => {
          subscriber.next(result);
          subscriber.complete();
        });
    });
  }
}
