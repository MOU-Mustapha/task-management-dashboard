import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { Task } from '../../models/task.model';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * Task Column Component
 *
 * Responsibilities:
 * - Renders a single task column (ToDo, In Progress, Done) with a title and task count.
 * - Displays a list of Task Card components.
 * - Supports drag-and-drop of tasks within the column and between connected columns.
 * - Emits events when a task is dropped into a different column.
 *
 * Inputs:
 * - `title: string` - Column title to display. Required.
 * - `tasks: Task[]` - Array of tasks in this column. Required.
 * - `columnId: string` - Unique ID for CDK drag-and-drop container. Required.
 * - `connectedIds: string[]` - Array of connected column IDs for cross-column dragging. Required.
 *
 * Outputs:
 * - `taskDropped` - Emits when a task is moved to a different column. Event includes:
 *   - `previousStatus`: string - Status of the previous column
 *   - `targetStatus`: string - Status of the target column
 *   - `task`: Task - The task being moved
 *   - `previousIndex`: number - Original index of the task
 *   - `currentIndex`: number - New index of the task
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-column',
  imports: [TaskCard, TranslateModule, DragDropModule],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskColumn {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) tasks!: Task[];
  @Input({ required: true }) columnId!: string;
  @Input({ required: true }) connectedIds!: string[];
  @Output() taskDropped = new EventEmitter<{
    previousStatus: string;
    targetStatus: string;
    task: Task;
    previousIndex: number;
    currentIndex: number;
  }>();
  // Returns the number of tasks in the column
  get tasksCount(): number {
    return this.tasks.length ?? 0;
  }
  /**
   * Handles drag-and-drop of tasks
   * - Reorders tasks within the same column using `moveItemInArray`.
   * - Emits `taskDropped` event when a task is moved to a different column.
   *
   * @param ev CdkDragDrop event
   */
  dragTask(ev: CdkDragDrop<Task[]>) {
    if (ev.previousContainer === ev.container) {
      moveItemInArray(this.tasks, ev.previousIndex, ev.currentIndex);
    } else {
      const task = ev.previousContainer.data[ev.previousIndex];
      this.taskDropped.emit({
        previousStatus: ev.previousContainer.id.replace('column-', ''),
        targetStatus: ev.container.id.replace('column-', ''),
        task,
        previousIndex: ev.previousIndex,
        currentIndex: ev.currentIndex,
      });
    }
  }
}
