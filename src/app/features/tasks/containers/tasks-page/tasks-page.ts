import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskFilter } from '../../components/task-filter/task-filter';
// import { TaskBoard } from '../../components/task-board/task-board';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskFilter],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {}
