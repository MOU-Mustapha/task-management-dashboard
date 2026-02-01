import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { TaskModal } from '../components/task-modal/task-modal';
import { TranslateService } from '@ngx-translate/core';

/**
 * Task Dialog Service
 *
 * Responsibilities:
 * - Handles opening of task creation and editing dialogs.
 * - Provides a clean API to open a modal with optional task data.
 * - Returns an observable that emits the task data once the modal is closed.
 *
 * Key Features:
 * 1. Reusable modal opening logic for creating or editing tasks.
 * 2. Uses PrimeNG `DialogService` to open `TaskModal` component.
 * 3. Dynamically sets modal header based on whether a task is being edited or created.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskDialogService {
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  /**
   * Opens the Task modal for creation or editing.
   * @param task Optional task to edit; if not provided, modal will be in create mode.
   * @returns Observable emitting the task once the modal is closed.
   */
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
      focusOnShow: false,
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
