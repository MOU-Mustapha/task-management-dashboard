import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/http/http-config/http-client.service';
import { httpResource } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private readonly httpClientService = inject(HttpClientService);
  readonly tasksResource = httpResource<Task[]>(
    () => this.httpClientService.fullRequestURL('/tasks'),
    {
      defaultValue: [],
    },
  );
  createTask(payload: Task): Observable<Task> {
    return this.httpClientService.post<Task>('/tasks', payload);
  }
  updateTask(task: Task): Observable<Task> {
    return this.httpClientService.put<Task>(`/tasks/${task.id}`, {
      ...task,
      updatedAt: new Date().toISOString(),
    });
  }
  deleteTask(taskId: string): Observable<void> {
    return this.httpClientService.delete<void>(`/tasks/${taskId}`);
  }
  getTaskById(taskId: string): Observable<Task> {
    return this.httpClientService.get<Task>(`/tasks/${taskId}`);
  }
  reloadTasks(): void {
    this.tasksResource.reload();
  }
}
