import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { Task } from '../../models/task.model';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

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
  get tasksCount(): number {
    return this.tasks.length ?? 0;
  }
  dragTask(ev: CdkDragDrop<Task[]>) {
    if (ev.previousContainer === ev.container) {
      console.log('Same Container');
      moveItemInArray(this.tasks, ev.previousIndex, ev.currentIndex);
    } else {
      console.log('Not Same Container');
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
