import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TasksFacade } from '../../services/tasks.facade';
import { TaskPriority, TaskStatus } from '../../models/task.model';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TaskDialogService } from '../../services/task-dialog.service';

/**
 * Task Filter Component
 *
 * Responsibilities:
 * - Provides UI for filtering tasks by status, priority, and assignee.
 * - Allows resetting all filters to default values.
 * - Supports creating a new task via TaskDialogService.
 * - Communicates filter changes to TasksFacade.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-filter',
  imports: [FormsModule, SelectModule, TranslateModule],
  templateUrl: './task-filter.html',
  styleUrl: './task-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFilter {
  private readonly tasksFacade = inject(TasksFacade);
  private readonly taskDialogService = inject(TaskDialogService);
  selectedStatus: TaskStatus | 'all' = 'all';
  selectedPriority: TaskPriority | 'all' = 'all';
  selectedAssignee: string | 'all' = 'all';
  // Available status tabs for filtering
  readonly statusTabs: Array<{ id: TaskStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'ToDo' },
    { id: 'in_progress', label: 'InProgress' },
    { id: 'done', label: 'Done' },
  ];
  // Available priority options for filtering
  readonly priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
    { value: 'all', label: 'Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  // Returns all available assignees from the TasksFacade
  get assignees() {
    return this.tasksFacade.assignees();
  }
  /**
   * Handles click on status tabs
   * Updates the selected status and notifies TasksFacade
   * @param status TaskStatus or 'all'
   */
  onTabClick(status: TaskStatus | 'all') {
    this.selectedStatus = status;
    this.tasksFacade.setStatusFilter(status);
  }
  /**
   * Handles click on assignee tabs
   * Updates the selected assignee and notifies TasksFacade
   * @param assignee Assignee ID or 'all'
   */
  onAssigneeClick(assigneeId: string | 'all') {
    this.selectedAssignee = assigneeId;
    this.tasksFacade.setAssigneeFilter(assigneeId);
  }
  /**
   * Handles change in priority dropdown
   * Updates the selected priority and notifies TasksFacade
   * @param priority TaskPriority or 'all'
   */
  onPriorityChange(priority: TaskPriority | 'all') {
    this.selectedPriority = priority;
    this.tasksFacade.setPriorityFilter(priority);
  }
  clearFilters() {
    this.selectedStatus = 'all';
    this.selectedPriority = 'all';
    this.selectedAssignee = 'all';
    this.tasksFacade.clearFilters();
  }
  openTaskModal() {
    this.taskDialogService.open();
  }
}
