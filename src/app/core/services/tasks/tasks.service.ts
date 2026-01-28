import { computed, inject, Injectable, signal } from '@angular/core';
import { Task } from '../../../models/task.model';
import { HttpClientService } from '../../http/http-config/http-client.service';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor() {
    this._tasks.set(this.tasksResource.value());
  }
  private readonly httpClientService = inject(HttpClientService);
  private _tasks = signal<Task[]>([]);
  private tasksResource = httpResource<Task[]>(
    () => this.httpClientService.fullRequestURL('tasks'),
    {
      defaultValue: [],
    },
  );

  get tasks() {
    return this._tasks;
  }
  completedTasks = computed(() => this._tasks().filter((t) => t.status === 'done').length);
  inProgressTasks = computed(() => this._tasks().filter((t) => t.status === 'in_progress').length);
  todoTasks = computed(() => this._tasks().filter((t) => t.status === 'todo').length);
  // overdueTasks = computed(() => this._tasks().filter((t) => t.isOverdue).length);

  createTask(task: Task) {
    return this.httpClientService.post<Task>('tasks', task).subscribe({
      next: (newTask) => this._tasks.update((tasks) => [...tasks, newTask]),
      error: (err) => console.error('Failed to create task', err),
    });
  }

  updateTask(task: Task) {
    return this.httpClientService.put<Task>(`tasks/${task.id}`, task).subscribe({
      next: (updatedTask) =>
        this._tasks.update((tasks) =>
          tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        ),
      error: (err) => console.error('Failed to update task', err),
    });
  }

  deleteTask(taskId: string) {
    return this.httpClientService.delete<void>(`tasks/${taskId}`).subscribe({
      next: () => this._tasks.update((tasks) => tasks.filter((t) => t.id !== taskId)),
      error: (err) => console.error('Failed to delete task', err),
    });
  }
}
