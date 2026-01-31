import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TasksFacade } from '../../services/tasks.facade';
import { CommonModule } from '@angular/common';
import { TaskDialogService } from '../../services/task-dialog.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, ConfirmDialog, DragDropModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  private readonly tasksFacade = inject(TasksFacade);
  private readonly taskDialogService = inject(TaskDialogService);
  isDragging: boolean = false;
  showDeleteDialog: boolean = false;
  @Input({ required: true }) task!: Task;
  get priorityClass(): string {
    return `priority-${this.task.priority}`;
  }
  get isOverdue(): boolean {
    return this.tasksFacade.isTaskOverdue(this.task);
  }

  get dueRelative(): string {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(this.task.dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (this.task.status === 'done') {
      const completed = new Date(this.task.completedAt);
      const completedDate = new Date(
        completed.getFullYear(),
        completed.getMonth(),
        completed.getDate(),
      );
      const completedDiff = Math.floor(
        (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (completedDiff === 0) return 'Completed today';
      if (completedDiff === 1) return 'Completed yesterday';
      return `Completed ${completedDiff} day${completedDiff > 1 ? 's' : ''} ago`;
    }
    if (diff < 0) return `⚠ Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''}`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `Due in ${diff} days`;
  }

  onEdit(): void {
    this.taskDialogService.open(this.task);
  }
  onDelete(): void {
    this.showDeleteDialog = true;
  }
  onConfirmDelete() {
    this.tasksFacade.delete(this.task.id).subscribe();
  }
  onDismissDelete() {
    this.showDeleteDialog = false;
  }
  changeStatusTo(newStatus: TaskStatus): void {
    if (newStatus !== this.task.status) {
      // this.statusChange.emit({ taskId: this.task.id, newStatus });
    }
  }
  get formattedAssignee(): string {
    return this.task.assignee?.name.split(' ')[0] ?? 'Unassigned';
  }
}
