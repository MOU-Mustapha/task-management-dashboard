import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { of } from 'rxjs';

import { Task, Assignee } from '../models/task.model';
import { TasksFacade } from './tasks.facade';
import { TasksApiService } from './tasks.api.service';

describe('TasksFacade', () => {
  let facade: TasksFacade;
  let tasksApiMock: {
    tasksResource: { value: Mock; reload: Mock };
    createTask: Mock;
    updateTask: Mock;
    deleteTask: Mock;
    reloadTasks: Mock;
  };

  const mockAssigneeA: Assignee = {
    id: 'a1',
    name: 'Alice',
    avatar: '',
    email: 'alice@example.com',
  };

  const mockAssigneeB: Assignee = {
    id: 'a2',
    name: 'Bob',
    avatar: '',
    email: 'bob@example.com',
  };

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-01-10',
      completedAt: '',
      assignee: mockAssigneeA,
      tags: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2025-01-12',
      completedAt: '',
      assignee: mockAssigneeB,
      tags: [],
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'done',
      priority: 'low',
      dueDate: '2025-01-08',
      completedAt: '2025-01-08T00:00:00Z',
      assignee: mockAssigneeA,
      tags: [],
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-03T00:00:00Z',
    },
  ];

  beforeEach(() => {
    tasksApiMock = {
      tasksResource: {
        value: vi.fn().mockReturnValue(mockTasks),
        reload: vi.fn(),
      },
      createTask: vi.fn().mockReturnValue(of(mockTasks[0])),
      updateTask: vi.fn().mockReturnValue(of(mockTasks[0])),
      deleteTask: vi.fn().mockReturnValue(of(void 0)),
      reloadTasks: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TasksFacade, { provide: TasksApiService, useValue: tasksApiMock }],
    });

    facade = TestBed.inject(TasksFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });

  it('should return tasks from API resource', () => {
    expect(facade.tasks()).toEqual(mockTasks);
  });

  describe('filtering', () => {
    it('should filter by status', () => {
      facade.setStatusFilter('todo');
      expect(facade.filteredTasks()).toEqual([mockTasks[0]]);
    });

    it('should filter by priority', () => {
      facade.setPriorityFilter('high');
      expect(facade.filteredTasks()).toEqual([mockTasks[0]]);
    });

    it('should filter by assignee', () => {
      facade.setAssigneeFilter('a2');
      expect(facade.filteredTasks()).toEqual([mockTasks[1]]);
    });

    it('should filter by search term', () => {
      facade.setSearch('Task 2');
      expect(facade.filteredTasks()).toEqual([mockTasks[1]]);
    });

    it('should clear all filters', () => {
      facade.setStatusFilter('done');
      facade.setPriorityFilter('low');
      facade.setAssigneeFilter('a1');
      facade.setSearch('Task');
      facade.clearFilters();
      const expectedSorted = [...mockTasks].sort((a, b) => {
        const aDate = new Date(a.updatedAt || a.createdAt).getTime();
        const bDate = new Date(b.updatedAt || b.createdAt).getTime();
        return bDate - aDate;
      });
      expect(facade.filteredTasks()).toEqual(expectedSorted);
    });
  });

  describe('grouped tasks', () => {
    it('should group todo tasks', () => {
      expect(facade.todo()).toEqual([mockTasks[0]]);
    });

    it('should group in-progress tasks', () => {
      expect(facade.inProgress()).toEqual([mockTasks[1]]);
    });

    it('should group done tasks', () => {
      expect(facade.done()).toEqual([mockTasks[2]]);
    });
  });

  describe('CRUD operations', () => {
    it('should create task and reload', () => {
      const result = facade.create(mockTasks[0]);
      result.subscribe();

      expect(tasksApiMock.createTask).toHaveBeenCalledWith(mockTasks[0]);
      expect(tasksApiMock.reloadTasks).toHaveBeenCalled();
    });

    it('should update task and reload', () => {
      const result = facade.update(mockTasks[0]);
      result.subscribe();

      expect(tasksApiMock.updateTask).toHaveBeenCalledWith(mockTasks[0]);
      expect(tasksApiMock.reloadTasks).toHaveBeenCalled();
    });

    it('should delete task and reload', () => {
      const result = facade.delete('1');
      result.subscribe();

      expect(tasksApiMock.deleteTask).toHaveBeenCalledWith('1');
      expect(tasksApiMock.reloadTasks).toHaveBeenCalled();
    });

    it('should update task status and reload', () => {
      const result = facade.updateTaskStatus(mockTasks[0], 'done');
      result.subscribe();

      expect(tasksApiMock.updateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockTasks[0],
          status: 'done',
          UpdatedAt: expect.any(String),
          completedAt: expect.any(String),
        }),
      );
      expect(tasksApiMock.reloadTasks).toHaveBeenCalled();
    });
  });

  describe('assignees', () => {
    it('should return unique assignees', () => {
      expect(facade.assignees()).toEqual([mockAssigneeA, mockAssigneeB]);
    });
  });

  describe('sorting', () => {
    it('should sort filteredTasks by updatedAt in descending order', () => {
      const tasksWithDifferentDates: Task[] = [
        {
          ...mockTasks[0],
          id: '1',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          ...mockTasks[1],
          id: '2',
          updatedAt: '2025-01-03T00:00:00Z',
        },
        {
          ...mockTasks[2],
          id: '3',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ];

      tasksApiMock.tasksResource.value.mockReturnValue(tasksWithDifferentDates);

      const filtered = facade.filteredTasks();

      expect(filtered).toEqual([
        tasksWithDifferentDates[1], // 2025-01-03 (newest)
        tasksWithDifferentDates[2], // 2025-01-02
        tasksWithDifferentDates[0], // 2025-01-01 (oldest)
      ]);
    });

    it('should sort by createdAt when updatedAt is not available', () => {
      const tasksWithoutUpdatedAt: Task[] = [
        {
          ...mockTasks[0],
          id: '1',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '',
        },
        {
          ...mockTasks[1],
          id: '2',
          createdAt: '2025-01-03T00:00:00Z',
          updatedAt: '',
        },
        {
          ...mockTasks[2],
          id: '3',
          createdAt: '2025-01-02T00:00:00Z',
          updatedAt: '',
        },
      ];

      tasksApiMock.tasksResource.value.mockReturnValue(tasksWithoutUpdatedAt);

      const filtered = facade.filteredTasks();

      expect(filtered).toEqual([
        tasksWithoutUpdatedAt[1], // 2025-01-03 (newest)
        tasksWithoutUpdatedAt[2], // 2025-01-02
        tasksWithoutUpdatedAt[0], // 2025-01-01 (oldest)
      ]);
    });

    it('should maintain sorting when filters are applied', () => {
      const tasksWithDifferentDates: Task[] = [
        {
          ...mockTasks[0],
          id: '1',
          status: 'todo',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          ...mockTasks[1],
          id: '2',
          status: 'todo',
          updatedAt: '2025-01-03T00:00:00Z',
        },
        {
          ...mockTasks[2],
          id: '3',
          status: 'done',
          updatedAt: '2025-01-02T00:00:00Z',
        },
      ];

      tasksApiMock.tasksResource.value.mockReturnValue(tasksWithDifferentDates);

      facade.setStatusFilter('todo');
      const filtered = facade.filteredTasks();

      expect(filtered).toEqual([
        tasksWithDifferentDates[1], // 2025-01-03 (newest todo)
        tasksWithDifferentDates[0], // 2025-01-01 (older todo)
      ]);
    });
  });

  describe('isTaskOverdue', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-11'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return false for done tasks', () => {
      expect(facade.isTaskOverdue(mockTasks[2])).toBe(false);
    });

    it('should return true for overdue tasks', () => {
      expect(facade.isTaskOverdue(mockTasks[0])).toBe(true);
    });

    it('should return false for non-overdue tasks', () => {
      expect(facade.isTaskOverdue(mockTasks[1])).toBe(false);
    });
  });
});
