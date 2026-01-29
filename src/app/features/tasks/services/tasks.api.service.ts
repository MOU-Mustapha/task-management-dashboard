import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/http/http-config/http-client.service';
import { httpResource } from '@angular/common/http';
import { Task } from '../models/task.model';

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
  createTask(task: Task) {
    return this.httpClientService.post<Task>('/tasks', task);
  }
  updateTask(task: Task) {
    return this.httpClientService.put<Task>(`/tasks/${task.id}`, task);
  }

  deleteTask(taskId: string) {
    return this.httpClientService.delete<void>(`/tasks/${taskId}`);
  }
}
