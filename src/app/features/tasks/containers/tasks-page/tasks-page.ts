import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskFilter } from '../../components/task-filter/task-filter';
import { TaskBoard } from '../../components/task-board/task-board';
import { TasksFacade } from '../../services/tasks.facade';

/**
 * Tasks Page Component
 *
 * Responsibilities:
 * - Serves as the main page for tasks in the application.
 * - Provides the UI for filtering and displaying tasks.
 * - Connects the task UI components (`TaskFilter` and `TaskBoard`) to the reactive `TasksFacade`.
 *
 * Composition:
 * - `<app-task-filter>`: Renders the task filters for status, priority, assignee.
 * - `<app-task-board>`: Displays tasks grouped by status (todo, in progress, done) in separate columns.
 *
 * Data Flow:
 * - All task data is provided via `TasksFacade`, which handles state, filtering, and CRUD operations.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-tasks-page',
  imports: [TaskFilter, TaskBoard],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {
  public readonly tasksFacade = inject(TasksFacade);
}
