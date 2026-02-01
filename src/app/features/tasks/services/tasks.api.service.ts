import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/http/http-config/http-client.service';
import { httpResource } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

/**
 * Tasks Api Service
 *
 * Responsibilities:
 * - Handles all HTTP operations for the Task entity.
 * - Provides a reactive `tasksResource` to keep the task list in sync across the app.
 * - Exposes CRUD operations: create, update, delete.
 * - Allows refreshing the task list by calling `reloadTasks`.
 *
 * Key Features:
 * 1. Reactive resource (`tasksResource`) for easily binding tasks to UI components.
 * 2. Methods return Observables to integrate seamlessly with Angular’s reactive patterns.
 * 3. Centralized API endpoint management via `HttpClientService`.
 */
@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private readonly httpClientService = inject(HttpClientService);
  readonly tasksResource = httpResource<Task[]>(
    () => this.httpClientService.fullRequestURL('tasks'),
    {
      defaultValue: [],
    },
  );
  createTask(task: Task): Observable<Task> {
    return this.httpClientService.post<Task>('tasks', task);
  }
  updateTask(task: Task): Observable<Task> {
    return this.httpClientService.put<Task>(`tasks/${task.id}`, task);
  }
  deleteTask(taskId: string): Observable<void> {
    return this.httpClientService.delete<void>(`tasks/${taskId}`);
  }
  reloadTasks(): void {
    this.tasksResource.reload();
  }
}
