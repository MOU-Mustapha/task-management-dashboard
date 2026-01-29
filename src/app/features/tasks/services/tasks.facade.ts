import { computed, inject, Injectable, signal } from '@angular/core';
import { TasksApiService } from './tasks.api.service';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly tasksApi = inject(TasksApiService);
  // UI State Signals
  private statusFilter = signal<TaskStatus | 'all'>('all');
  private priorityFilter = signal<TaskPriority | 'all'>('all');
  private searchTerm = signal<string>('');
  // Data Source
  readonly tasks = computed(() => this.tasksApi.tasksResource.value() ?? []);
  // Derived State
  readonly filteredTasks = computed(() => {
    return this.tasks().filter((t) => {
      const matchesStatus = this.statusFilter() === 'all' || t.status === this.statusFilter();
      const matchesPriority =
        this.priorityFilter() === 'all' || t.priority === this.priorityFilter();
      const matchesSearchTerm =
        t.title.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm().toLowerCase());
      return matchesStatus && matchesPriority && matchesSearchTerm;
    });
  });
  // Group Tasks by Status
  readonly todo = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  readonly inProgress = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'in_progress'),
  );
  readonly done = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));
  // Task Statistics
  // readonly statistics = computed(() => {
  //   const allTasks = this.tasks();
  //   const total = allTasks.length;
  //   const completed = allTasks.filter((t) => t.status === 'done').length;
  //   const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  //   const overdue = allTasks.filter((t) => this.isTaskOverdue(t)).length;
  //   return {
  //     total,
  //     completed,
  //     inProgress,
  //     overdue,
  //     completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  //   };
  // });
  // Task distribution by priority
  // readonly priorityDistribution = computed(() => {
  //   const tasks = this.tasks();
  //   return {
  //     high: tasks.filter((t) => t.priority === 'high').length,
  //     medium: tasks.filter((t) => t.priority === 'medium').length,
  //     low: tasks.filter((t) => t.priority === 'low').length,
  //   };
  // });
  // Task distribution by status
  // readonly statusDistribution = computed(() => {
  //   const tasks = this.tasks();
  //   return {
  //     todo: tasks.filter((t) => t.status === 'todo').length,
  //     inProgress: tasks.filter((t) => t.status === 'in_progress').length,
  //     done: tasks.filter((t) => t.status === 'done').length,
  //   };
  // });
  // Filter Commands
  setStatusFilter(status: TaskStatus | 'all'): void {
    this.statusFilter.set(status);
  }
  setPriorityFilter(priority: TaskPriority | 'all'): void {
    this.priorityFilter.set(priority);
  }
  setSearch(term: string) {
    this.searchTerm.set(term);
  }
  clearFilters(): void {
    this.statusFilter.set('all');
    this.priorityFilter.set('all');
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
  getTaskById(taskId: string): Observable<Task> {
    return this.tasksApi.getTaskById(taskId);
  }
  updateTaskStatus(taskId: string, newStatus: TaskStatus): Observable<Task> | void {
    const task = this.tasks().find((t) => t.id === taskId);
    if (!task) return;
    const updatedTask = {
      ...task,
      status: newStatus,
      UpdatedAt: new Date().toISOString(),
    };
    return this.update(updatedTask);
  }
  // Get All Assignees From Tasks
  readonly assignees = computed(() => {
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
    return dueDate < now && dueDate.toDateString() !== now.toDateString();
  }
}
