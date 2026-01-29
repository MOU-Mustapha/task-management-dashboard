import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TasksFacade } from '../../services/tasks.facade';
import { TaskPriority, TaskStatus } from '../../models/task.model';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-filter',
  imports: [FormsModule, SelectModule, TranslateModule],
  templateUrl: './task-filter.html',
  styleUrl: './task-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFilter {
  private readonly tasksFacade = inject(TasksFacade);
  selectedStatus: TaskStatus | 'all' = 'all';
  selectedPriority: TaskPriority | 'all' = 'all';
  readonly statusTabs: Array<{ id: TaskStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'ToDo' },
    { id: 'in_progress', label: 'InProgress' },
    { id: 'done', label: 'Done' },
  ];
  readonly priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
    { value: 'all', label: 'Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  get assignees() {
    return this.tasksFacade.assignees();
  }
  onTabClick(status: TaskStatus | 'all') {
    this.selectedStatus = status;
    this.tasksFacade.setStatusFilter(status);
  }
  onPriorityChange(priority: TaskPriority | 'all') {
    this.selectedPriority = priority;
    this.tasksFacade.setPriorityFilter(priority);
  }
  clearFilters() {
    this.selectedStatus = 'all';
    this.selectedPriority = 'all';
    this.tasksFacade.clearFilters();
  }
  onNewTaskClick() {
    // open the task modal
  }
}
