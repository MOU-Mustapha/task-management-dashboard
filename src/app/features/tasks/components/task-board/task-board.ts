import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskColumn } from '../task-column/task-column';
import { Task } from '../../models/task.model';
import { TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumn],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoard {
  @Input({ required: true }) todo!: Task[];
  @Input({ required: true }) inProgress!: Task[];
  @Input({ required: true }) done!: Task[];
  readonly columns = [
    { title: 'ToDo', status: 'todo' as TaskStatus },
    { title: 'InProgress', status: 'in_progress' as TaskStatus },
    { title: 'Done', status: 'done' as TaskStatus },
  ];
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
}
