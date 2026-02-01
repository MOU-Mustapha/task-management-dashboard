import { computed, inject, Injectable, signal } from '@angular/core';
import { TasksApiService } from './tasks.api.service';
import { Assignee, Task, TaskPriority, TaskStatus } from '../models/task.model';
import { Observable, tap } from 'rxjs';

/**
 * Tasks Facade
 *
 * Responsibilities:
 * - Acts as the single source of truth for all task-related data in the frontend.
 * - Provides reactive state management for tasks using Angular signals and computed values.
 * - Implements filtering, searching, grouping, and task status updates.
 * - Wraps CRUD operations from TasksApiService and ensures the reactive task resource is updated automatically.
 */
@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly tasksApi = inject(TasksApiService);
  // UI State Signals
  private statusFilter = signal<TaskStatus | 'all'>('all');
  private priorityFilter = signal<TaskPriority | 'all'>('all');
  private assigneeFilter = signal<string | 'all'>('all');
  private searchTerm = signal<string>('');
  // Data Source
  readonly tasks = computed(() => this.tasksApi.tasksResource.value() ?? []);
  // Derived State
  readonly filteredTasks = computed(() => {
    return this.tasks().filter((t) => {
      const matchesStatus = this.statusFilter() === 'all' || t.status === this.statusFilter();
      const matchesPriority =
        this.priorityFilter() === 'all' || t.priority === this.priorityFilter();
      const matchesAssignee =
        this.assigneeFilter() === 'all' || t.assignee.id === this.assigneeFilter();
      const matchesSearchTerm =
        t.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm().toLowerCase());
      return matchesStatus && matchesPriority && matchesAssignee && matchesSearchTerm;
    });
  });
  // Group Tasks by Status
  readonly todo = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  readonly inProgress = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'in_progress'),
  );
  readonly done = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));
  // Filter Commands
  setStatusFilter(status: TaskStatus | 'all'): void {
    this.statusFilter.set(status);
  }
  setPriorityFilter(priority: TaskPriority | 'all'): void {
    this.priorityFilter.set(priority);
  }
  setAssigneeFilter(assignee: string | 'all'): void {
    this.assigneeFilter.set(assignee);
  }
  setSearch(term: string) {
    this.searchTerm.set(term);
  }
  clearFilters(): void {
    this.statusFilter.set('all');
    this.priorityFilter.set('all');
    this.assigneeFilter.set('all');
    this.searchTerm.set('');
  }
  // CRUD Operations With json-server
  create(task: Task): Observable<Task> {
    return this.tasksApi.createTask(task).pipe(tap(() => this.tasksApi.reloadTasks()));
  }
  update(task: Task): Observable<Task> {
    return this.tasksApi.updateTask(task).pipe(tap(() => this.tasksApi.reloadTasks()));
  }
  delete(taskId: string): Observable<void> {
    return this.tasksApi.deleteTask(taskId).pipe(tap(() => this.tasksApi.reloadTasks()));
  }
  updateTaskStatus(task: Task, newStatus: TaskStatus): Observable<Task> {
    const updatedTask = {
      ...task,
      status: newStatus,
      UpdatedAt: new Date().toISOString(),
      completedAt: newStatus === 'done' ? new Date().toISOString() : '',
    };
    return this.update(updatedTask);
  }
  // Get All Assignees From Tasks
  readonly assignees = computed<Assignee[]>(() => {
    const assigneeSet = new Set<string>();
    return this.tasks()
      .map((t) => t.assignee)
      .filter((a) => {
        if (assigneeSet.has(a.id)) return false;
        assigneeSet.add(a.id);
        return true;
      });
  });
  // Helpers Methods
  isTaskOverdue(task: Task): boolean {
    if (task.status === 'done') return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    dueDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return dueDate < now && dueDate.toDateString() !== now.toDateString();
  }
}
