import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskFilter } from '../../components/task-filter/task-filter';
import { TaskBoard } from '../../components/task-board/task-board';
import { TasksFacade } from '../../services/tasks.facade';

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
