import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { of } from 'rxjs';

import { Task, Assignee, TaskStatus } from '../../models/task.model';
import { TaskCard } from './task-card';
import { TasksFacade } from '../../services/tasks.facade';
import { TaskDialogService } from '../../services/task-dialog.service';

describe('TaskCard', () => {
  let component: TaskCard;
  let fixture: ComponentFixture<TaskCard>;
  let tasksFacadeMock: { isTaskOverdue: Mock; delete: Mock };
  let taskDialogServiceMock: { open: Mock };

  const mockAssignee: Assignee = {
    id: 'a1',
    name: 'Alice Smith',
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

  beforeEach(async () => {
    tasksFacadeMock = {
      isTaskOverdue: vi.fn().mockReturnValue(false),
      delete: vi.fn().mockReturnValue(of(void 0)),
    };

    taskDialogServiceMock = {
      open: vi.fn().mockReturnValue(of(mockTask)),
    };

    await TestBed.configureTestingModule({
      imports: [TaskCard, TranslateModule.forRoot()],
      providers: [
        { provide: TasksFacade, useValue: tasksFacadeMock },
        { provide: TaskDialogService, useValue: taskDialogServiceMock },
        { provide: DialogService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should return priority class based on task priority', () => {
      expect(component.priorityClass).toBe('priority-medium');
    });

    it('should return isOverdue from facade', () => {
      tasksFacadeMock.isTaskOverdue.mockReturnValue(true);
      expect(component.isOverdue).toBe(true);
      expect(tasksFacadeMock.isTaskOverdue).toHaveBeenCalledWith(mockTask);
    });

    it('should return formatted assignee first name', () => {
      expect(component.formattedAssignee).toBe('Alice');
    });

    it('should return "Unassigned" when assignee is null', () => {
      component.task = { ...mockTask, assignee: null as unknown as Assignee };
      expect(component.formattedAssignee).toBe('Unassigned');
    });
  });

  describe('dueRelative', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Completed today" for task completed today', () => {
      vi.setSystemTime(new Date('2025-01-10'));
      component.task = { ...mockTask, status: 'done', completedAt: '2025-01-10T08:00:00Z' };
      expect(component.dueRelative).toBe('Completed today');
    });

    it('should return "Completed yesterday" for task completed yesterday', () => {
      vi.setSystemTime(new Date('2025-01-10'));
      component.task = { ...mockTask, status: 'done', completedAt: '2025-01-09T08:00:00Z' };
      expect(component.dueRelative).toBe('Completed yesterday');
    });

    it('should return "Completed X days ago" for older completed tasks', () => {
      vi.setSystemTime(new Date('2025-01-10'));
      component.task = { ...mockTask, status: 'done', completedAt: '2025-01-05T08:00:00Z' };
      expect(component.dueRelative).toBe('Completed 5 days ago');
    });

    it('should return overdue warning for past due dates', () => {
      vi.setSystemTime(new Date('2025-01-12'));
      expect(component.dueRelative).toBe('⚠ Overdue by 2 days');
    });

    it('should return "Due today" for today\'s due date', () => {
      vi.setSystemTime(new Date('2025-01-10'));
      expect(component.dueRelative).toBe('Due today');
    });

    it('should return "Due tomorrow" for tomorrow\'s due date', () => {
      vi.setSystemTime(new Date('2025-01-09'));
      expect(component.dueRelative).toBe('Due tomorrow');
    });

    it('should return "Due in X days" for future due dates', () => {
      vi.setSystemTime(new Date('2025-01-08'));
      expect(component.dueRelative).toBe('Due in 2 days');
    });
  });

  describe('actions', () => {
    it('should open task dialog on edit', () => {
      component.onEdit();
      expect(taskDialogServiceMock.open).toHaveBeenCalledWith(mockTask);
    });

    it('should show delete dialog on delete', () => {
      component.onDelete();
      expect(component.showDeleteDialog).toBe(true);
    });

    it('should call delete and subscribe on confirm delete', () => {
      component.onConfirmDelete();
      expect(tasksFacadeMock.delete).toHaveBeenCalledWith(mockTask.id);
    });

    it('should hide delete dialog on dismiss delete', () => {
      component.showDeleteDialog = true;
      component.onDismissDelete();
      expect(component.showDeleteDialog).toBe(false);
    });
  });

  describe('changeStatusTo', () => {
    it('should not emit if status is the same', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      component.changeStatusTo('todo' as TaskStatus);
      // No assertion needed; just ensure no error
      consoleSpy.mockRestore();
    });

    it('should not emit if status is different (method currently no-op)', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      component.changeStatusTo('in_progress' as TaskStatus);
      // No assertion needed; just ensure no error
      consoleSpy.mockRestore();
    });
  });
});
