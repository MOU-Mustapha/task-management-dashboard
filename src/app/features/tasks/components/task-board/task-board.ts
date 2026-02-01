import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { TaskColumn } from '../task-column/task-column';
import { Task } from '../../models/task.model';
import { TaskStatus } from '../../models/task.model';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksFacade } from '../../services/tasks.facade';

/**
 * Task Board Component
 *
 * Responsibilities:
 * - Displays tasks board, grouped by status: "ToDo", "InProgress", and "Done".
 * - Provides drag-and-drop functionality to move tasks between columns.
 * - Handles updating task status via the reactive `TasksFacade`.
 *
 * Inputs:
 * - `todo` (Task[]): List of tasks with status 'todo'.
 * - `inProgress` (Task[]): List of tasks with status 'in_progress'.
 * - `done` (Task[]): List of tasks with status 'done'.
 *
 * Columns:
 * - Each column is represented by a `<app-task-column>` component.
 *
 * Drag-and-Drop:
 * - Uses Angular CDK's `transferArrayItem` to move tasks between arrays locally.
 * - Calls `TasksFacade.updateTaskStatus()` to persist the status change.
 * - Supports connected columns to allow cross-column dragging.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-board',
  imports: [TaskColumn],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoard {
  private readonly tasksFacade = inject(TasksFacade);
  @Input({ required: true }) todo!: Task[];
  @Input({ required: true }) inProgress!: Task[];
  @Input({ required: true }) done!: Task[];
  readonly columns = [
    { title: 'ToDo', status: 'todo' as TaskStatus },
    { title: 'InProgress', status: 'in_progress' as TaskStatus },
    { title: 'Done', status: 'done' as TaskStatus },
  ];
  // returns tasks list for a specific status
  getTasksByStatus(status: TaskStatus): Task[] {
    switch (status) {
      case 'todo':
        return this.todo;
      case 'in_progress':
        return this.inProgress;
      case 'done':
        return this.done;
      default:
        return [];
    }
  }
  // Returns the IDs of columns that this column can connect to for drag-and-drop
  getConnectedColumnIds(columnStatus: TaskStatus): string[] {
    return this.columns.filter((c) => c.status !== columnStatus).map((c) => 'column-' + c.status);
  }
  // Handles a task being dropped into a new column
  onTaskDropped(event: {
    previousStatus: string;
    targetStatus: string;
    task: Task;
    previousIndex: number;
    currentIndex: number;
  }) {
    const { previousStatus, targetStatus, task, previousIndex, currentIndex } = event;
    if (previousStatus === targetStatus) return;
    const prevList = this.getTasksByStatus(previousStatus as TaskStatus);
    const targetList = this.getTasksByStatus(targetStatus as TaskStatus);
    transferArrayItem(prevList, targetList, previousIndex, currentIndex);
    this.tasksFacade.updateTaskStatus(task, targetStatus as TaskStatus).subscribe();
  }
}
