import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Task } from '../../models/task.model';
import { TasksFacade } from '../../services/tasks.facade';

@Component({
  selector: 'app-task-modal',
  imports: [CommonModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModal {
  @Input() task: Task | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Task>();
  @Output() closeModal = new EventEmitter<void>();
  private readonly tasksFacade = inject(TasksFacade);
}
