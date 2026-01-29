import { computed, inject, Injectable, signal } from '@angular/core';
import { TasksApiService } from './tasks.api.service';
import { Task, TaskStatus } from '../models/task.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly tasksApi = inject(TasksApiService);
  // UI State
  private statusFilter = signal<TaskStatus | 'all'>('all');
  private searchTerm = signal<string>('');
  // Data Source
  readonly tasks = computed(() => this.tasksApi.tasksResource.value() ?? []);
  // Derived State
  readonly filteredTasks = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase();
    return this.tasks().filter(
      (t) =>
        (this.statusFilter() === 'all' || t.status === this.statusFilter()) &&
        (t.title.toLowerCase().includes(searchTerm) ||
          t.description.toLowerCase().includes(searchTerm)),
    );
  });
  readonly todo = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  readonly inProgress = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'in_progress'),
  );
  readonly done = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));
  // Commands
  setFilter(status: TaskStatus | 'all') {
    this.statusFilter.set(status);
  }
  setSearch(term: string) {
    this.searchTerm.set(term);
  }
  create(task: Task) {
    return this.tasksApi.createTask(task).pipe(tap(() => this.tasksApi.tasksResource.reload()));
  }
  update(task: Task) {
    return this.tasksApi.updateTask(task).pipe(tap(() => this.tasksApi.tasksResource.reload()));
  }
  delete(id: string) {
    return this.tasksApi.deleteTask(id).pipe(tap(() => this.tasksApi.tasksResource.reload()));
  }
}
