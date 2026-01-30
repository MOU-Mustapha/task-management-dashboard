import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { TaskModal } from '../components/task-modal/task-modal';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TaskDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  open(task?: Task): Observable<Task | undefined> {
    const ref = this.dialogService.open(TaskModal, {
      header: task
        ? this.translateService.instant('EditTask')
        : this.translateService.instant('CreateTask'),
      width: '70%',
      height: 'fit-content',
      draggable: false,
      data: { task: task ?? null },
      closable: false,
      modal: true,
      breakpoints: {
        '1024px': '70%',
        '768px': '90%',
        '560px': '95%',
      },
    });
    return new Observable((subscriber) => {
      if (ref)
        ref.onClose.subscribe((result?: Task) => {
          subscriber.next(result);
          subscriber.complete();
        });
    });
  }
}
