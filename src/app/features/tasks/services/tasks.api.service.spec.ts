import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { of } from 'rxjs';

import { Task, Assignee } from '../models/task.model';
import { TasksApiService } from './tasks.api.service';
import { HttpClientService } from '../../../core/http/http-config/http-client.service';

const { httpResourceMock } = vi.hoisted(() => ({
  httpResourceMock: vi.fn(),
}));

vi.mock('@angular/common/http', async () => {
  const actual =
    await vi.importActual<typeof import('@angular/common/http')>('@angular/common/http');
  return {
    ...actual,
    httpResource: httpResourceMock,
  };
});

describe('TasksApiService', () => {
  let service: TasksApiService;
  let httpClientServiceMock: {
    fullRequestURL: Mock;
    post: Mock;
    put: Mock;
    delete: Mock;
  };

  const mockAssignee: Assignee = {
    id: 'a1',
    name: 'John Doe',
    avatar: '',
    email: 'john@example.com',
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-01-01',
    completedAt: '',
    assignee: mockAssignee,
    tags: ['bug'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    httpClientServiceMock = {
      fullRequestURL: vi.fn().mockReturnValue('/api/tasks'),
      post: vi.fn(),
      put: vi.fn(() => of(mockTask)),
      delete: vi.fn(() => of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [TasksApiService, { provide: HttpClientService, useValue: httpClientServiceMock }],
    });

    service = TestBed.inject(TasksApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize tasksResource with correct URL and default value', () => {
    expect(httpResourceMock).toHaveBeenCalledWith(expect.any(Function), { defaultValue: [] });
    const urlFn = httpResourceMock.mock.calls[0][0];
    expect(urlFn()).toBe('/api/tasks');
  });

  it('should call createTask with correct endpoint and body', () => {
    const taskObservable = of(mockTask);
    httpClientServiceMock.post.mockReturnValue(taskObservable);

    const result = service.createTask(mockTask);

    expect(httpClientServiceMock.post).toHaveBeenCalledWith('tasks', mockTask);
    expect(result).toBe(taskObservable);
  });

  it('should call updateTask with correct endpoint and body', () => {
    const taskObservable = of(mockTask);
    httpClientServiceMock.put.mockReturnValue(taskObservable);

    const result = service.updateTask(mockTask);

    expect(httpClientServiceMock.put).toHaveBeenCalledWith(`tasks/${mockTask.id}`, mockTask);
    expect(result).toBe(taskObservable);
  });

  it('should call deleteTask with correct endpoint', () => {
    const voidObservable = of(void 0);
    httpClientServiceMock.delete.mockReturnValue(voidObservable);

    const result = service.deleteTask(mockTask.id);

    expect(httpClientServiceMock.delete).toHaveBeenCalledWith(`tasks/${mockTask.id}`);
    expect(result).toBe(voidObservable);
  });

  it('should call reloadTasks on the resource', () => {
    const reloadMock = vi.fn();
    httpResourceMock.mockReturnValue({
      reload: reloadMock,
      value: vi.fn().mockReturnValue([mockTask]),
    });

    TestBed.resetTestingModule().configureTestingModule({
      providers: [TasksApiService, { provide: HttpClientService, useValue: httpClientServiceMock }],
    });
    service = TestBed.inject(TasksApiService);

    service.reloadTasks();

    expect(reloadMock).toHaveBeenCalled();
  });
});
