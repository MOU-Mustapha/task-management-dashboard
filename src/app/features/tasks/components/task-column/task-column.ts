import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { Task } from '../../models/task.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-column',
  imports: [TaskCard, TranslateModule],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskColumn {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) tasks!: Task[];
  get tasksCount(): number {
    return this.tasks.length ?? 0;
  }
}
