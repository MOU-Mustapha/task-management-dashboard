import { inject, Injectable } from '@angular/core';
import { GlobalErrorObject } from '../../../shared/models/error.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { GlobalError } from '../../../shared/components/global-error/global-error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private dialogService = inject(DialogService);
  show(error: GlobalErrorObject): Observable<GlobalErrorObject | undefined> {
    const ref = this.dialogService.open(GlobalError, {
      header: 'Error',
      width: '25%',
      height: 'fit-content',
      draggable: false,
      data: { error },
      closable: true,
      modal: true,
      breakpoints: {
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
