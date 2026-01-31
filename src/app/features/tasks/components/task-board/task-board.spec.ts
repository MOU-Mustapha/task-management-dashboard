import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { of } from 'rxjs';

import { Task, Assignee, TaskStatus } from '../../models/task.model';
import { TaskBoard } from './task-board';
import { TasksFacade } from '../../services/tasks.facade';

describe('TaskBoard', () => {
  let component: TaskBoard;
  let fixture: ComponentFixture<TaskBoard>;
  let tasksFacadeMock: { updateTaskStatus: Mock; isTaskOverdue: Mock };

  const mockAssignee: Assignee = {
    id: 'a1',
    name: 'Alice',
    avatar: '',
    email: 'alice@example.com',
  };

  const mockTask: Task = {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-01-10',
    completedAt: '',
    assignee: mockAssignee,
    tags: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  const mockTasksTodo: Task[] = [mockTask];
  const mockTasksInProgress: Task[] = [];
  const mockTasksDone: Task[] = [];

  beforeEach(async () => {
    tasksFacadeMock = {
      updateTaskStatus: vi.fn().mockReturnValue(of(mockTask)),
      isTaskOverdue: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [TaskBoard, TranslateModule.forRoot()],
      providers: [
        { provide: TasksFacade, useValue: tasksFacadeMock },
        { provide: DialogService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoard);
    component = fixture.componentInstance;
    component.todo = mockTasksTodo;
    component.inProgress = mockTasksInProgress;
    component.done = mockTasksDone;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('columns', () => {
    it('should define three columns with correct titles and statuses', () => {
      expect(component.columns).toEqual([
        { title: 'ToDo', status: 'todo' },
        { title: 'InProgress', status: 'in_progress' },
        { title: 'Done', status: 'done' },
      ]);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return todo tasks for status todo', () => {
      expect(component.getTasksByStatus('todo')).toBe(mockTasksTodo);
    });

    it('should return in-progress tasks for status in_progress', () => {
      expect(component.getTasksByStatus('in_progress')).toBe(mockTasksInProgress);
    });

    it('should return done tasks for status done', () => {
      expect(component.getTasksByStatus('done')).toBe(mockTasksDone);
    });

    it('should return empty array for unknown status', () => {
      expect(component.getTasksByStatus('unknown' as TaskStatus)).toEqual([]);
    });
  });

  describe('getConnectedColumnIds', () => {
    it('should return connected column IDs excluding the current column', () => {
      expect(component.getConnectedColumnIds('todo')).toEqual([
        'column-in_progress',
        'column-done',
      ]);
      expect(component.getConnectedColumnIds('in_progress')).toEqual([
        'column-todo',
        'column-done',
      ]);
      expect(component.getConnectedColumnIds('done')).toEqual([
        'column-todo',
        'column-in_progress',
      ]);
    });
  });

  describe('onTaskDropped', () => {
    it('should not do anything if previousStatus equals targetStatus', () => {
      const event = {
        previousStatus: 'todo',
        targetStatus: 'todo',
        task: mockTask,
        previousIndex: 0,
        currentIndex: 0,
      };
      component.onTaskDropped(event);
      expect(tasksFacadeMock.updateTaskStatus).not.toHaveBeenCalled();
    });

    it('should transfer task between lists and call updateTaskStatus when moving from todo to in_progress', () => {
      const event = {
        previousStatus: 'todo',
        targetStatus: 'in_progress',
        task: mockTask,
        previousIndex: 0,
        currentIndex: 0,
      };
      component.onTaskDropped(event);

      expect(component.todo).toEqual([]);
      expect(component.inProgress).toEqual([mockTask]);
      expect(tasksFacadeMock.updateTaskStatus).toHaveBeenCalledWith(mockTask, 'in_progress');
    });

    it('should transfer task between lists and call updateTaskStatus when moving from in_progress to done', () => {
      const taskInProgress: Task = { ...mockTask, status: 'in_progress' };
      component.inProgress = [taskInProgress];
      component.done = [];
      fixture.detectChanges();

      const event = {
        previousStatus: 'in_progress',
        targetStatus: 'done',
        task: taskInProgress,
        previousIndex: 0,
        currentIndex: 0,
      };
      component.onTaskDropped(event);

      expect(component.inProgress).toEqual([]);
      expect(component.done).toEqual([taskInProgress]);
      expect(tasksFacadeMock.updateTaskStatus).toHaveBeenCalledWith(taskInProgress, 'done');
    });
  });
});
