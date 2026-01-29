import { Component, Input } from '@angular/core';
// import { TaskColumn } from '../task-column/task-column';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-board',
  imports: [],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
})
export class TaskBoard {
  @Input({ required: true }) todo!: Task[];
  @Input({ required: true }) inProgress!: Task[];
  @Input({ required: true }) done!: Task[];
}
