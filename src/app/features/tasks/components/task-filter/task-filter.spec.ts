import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TaskFilter } from './task-filter';
import { TasksFacade } from '../../services/tasks.facade';
import { TaskDialogService } from '../../services/task-dialog.service';
import { Assignee, TaskPriority, TaskStatus } from '../../models/task.model';

interface MockTasksFacade {
  setStatusFilter: ReturnType<typeof vi.fn>;
  setAssigneeFilter: ReturnType<typeof vi.fn>;
  setPriorityFilter: ReturnType<typeof vi.fn>;
  clearFilters: ReturnType<typeof vi.fn>;
  assignees: ReturnType<typeof vi.fn>;
}

interface MockTaskDialogService {
  open: ReturnType<typeof vi.fn>;
}

describe('TaskFilter', () => {
  let component: TaskFilter;
  let fixture: ComponentFixture<TaskFilter>;
  let mockTasksFacade: MockTasksFacade;
  let mockTaskDialogService: MockTaskDialogService;

  const mockAssignees: Assignee[] = [
    { id: 'a1', name: 'Alice', avatar: '', email: 'alice@example.com' },
    { id: 'a2', name: 'Bob', avatar: '', email: 'bob@example.com' },
  ];

  beforeEach(async () => {
    mockTasksFacade = {
      setStatusFilter: vi.fn(),
      setAssigneeFilter: vi.fn(),
      setPriorityFilter: vi.fn(),
      clearFilters: vi.fn(),
      assignees: vi.fn().mockReturnValue(mockAssignees),
    };

    mockTaskDialogService = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TaskFilter, TranslateModule.forRoot(), SelectModule, FormsModule],
      providers: [
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: TaskDialogService, useValue: mockTaskDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default filter values', () => {
      expect(component.selectedStatus).toBe('all');
      expect(component.selectedPriority).toBe('all');
      expect(component.selectedAssignee).toBe('all');
    });

    it('should have correct status tabs configuration', () => {
      expect(component.statusTabs).toEqual([
        { id: 'all', label: 'All' },
        { id: 'todo', label: 'ToDo' },
        { id: 'in_progress', label: 'InProgress' },
        { id: 'done', label: 'Done' },
      ]);
    });

    it('should have correct priority options configuration', () => {
      expect(component.priorityOptions).toEqual([
        { value: 'all', label: 'Priority' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ]);
    });

    it('should return assignees from facade', () => {
      expect(component.assignees).toEqual(mockAssignees);
      expect(mockTasksFacade.assignees).toHaveBeenCalled();
    });
  });

  describe('Status Filtering', () => {
    it('should handle tab click for status filter', () => {
      const status: TaskStatus = 'todo';
      component.onTabClick(status);

      expect(component.selectedStatus).toBe(status);
      expect(mockTasksFacade.setStatusFilter).toHaveBeenCalledWith(status);
    });

    it('should handle "all" status filter', () => {
      component.onTabClick('all');

      expect(component.selectedStatus).toBe('all');
      expect(mockTasksFacade.setStatusFilter).toHaveBeenCalledWith('all');
    });

    it('should handle each status option', () => {
      const statuses: Array<TaskStatus | 'all'> = ['all', 'todo', 'in_progress', 'done'];

      statuses.forEach((status) => {
        component.onTabClick(status);
        expect(component.selectedStatus).toBe(status);
        expect(mockTasksFacade.setStatusFilter).toHaveBeenCalledWith(status);
      });
    });
  });

  describe('Assignee Filtering', () => {
    it('should handle assignee click for assignee filter', () => {
      const assigneeId = 'a1';
      component.onAssigneeClick(assigneeId);

      expect(component.selectedAssignee).toBe(assigneeId);
      expect(mockTasksFacade.setAssigneeFilter).toHaveBeenCalledWith(assigneeId);
    });

    it('should handle "all" assignee filter', () => {
      component.onAssigneeClick('all');

      expect(component.selectedAssignee).toBe('all');
      expect(mockTasksFacade.setAssigneeFilter).toHaveBeenCalledWith('all');
    });

    it('should handle each assignee option', () => {
      const assigneeIds: Array<'all' | string> = ['all', 'a1', 'a2'];

      assigneeIds.forEach((assigneeId) => {
        component.onAssigneeClick(assigneeId);
        expect(component.selectedAssignee).toBe(assigneeId);
        expect(mockTasksFacade.setAssigneeFilter).toHaveBeenCalledWith(assigneeId);
      });
    });
  });

  describe('Priority Filtering', () => {
    it('should handle priority change for priority filter', () => {
      const priority: TaskPriority = 'high';
      component.onPriorityChange(priority);

      expect(component.selectedPriority).toBe(priority);
      expect(mockTasksFacade.setPriorityFilter).toHaveBeenCalledWith(priority);
    });

    it('should handle "all" priority filter', () => {
      component.onPriorityChange('all');

      expect(component.selectedPriority).toBe('all');
      expect(mockTasksFacade.setPriorityFilter).toHaveBeenCalledWith('all');
    });

    it('should handle each priority option', () => {
      const priorities: Array<TaskPriority | 'all'> = ['all', 'high', 'medium', 'low'];

      priorities.forEach((priority) => {
        component.onPriorityChange(priority);
        expect(component.selectedPriority).toBe(priority);
        expect(mockTasksFacade.setPriorityFilter).toHaveBeenCalledWith(priority);
      });
    });
  });

  describe('Clear Filters', () => {
    it('should reset all filters to default values', () => {
      // Set some non-default values first
      component.selectedStatus = 'todo';
      component.selectedPriority = 'high';
      component.selectedAssignee = 'a1';

      component.clearFilters();

      expect(component.selectedStatus).toBe('all');
      expect(component.selectedPriority).toBe('all');
      expect(component.selectedAssignee).toBe('all');
      expect(mockTasksFacade.clearFilters).toHaveBeenCalled();
    });
  });

  describe('Task Modal', () => {
    it('should open task modal when create button is clicked', () => {
      component.openTaskModal();

      expect(mockTaskDialogService.open).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should maintain filter state consistency', () => {
      // Set multiple filters
      component.onTabClick('todo');
      component.onPriorityChange('high');
      component.onAssigneeClick('a1');

      expect(component.selectedStatus).toBe('todo');
      expect(component.selectedPriority).toBe('high');
      expect(component.selectedAssignee).toBe('a1');

      // Clear filters
      component.clearFilters();

      expect(component.selectedStatus).toBe('all');
      expect(component.selectedPriority).toBe('all');
      expect(component.selectedAssignee).toBe('all');
    });

    it('should handle rapid filter changes', () => {
      // Rapidly change filters
      component.onTabClick('todo');
      component.onTabClick('in_progress');
      component.onPriorityChange('high');
      component.onPriorityChange('low');
      component.onAssigneeClick('a1');
      component.onAssigneeClick('all');

      expect(component.selectedStatus).toBe('in_progress');
      expect(component.selectedPriority).toBe('low');
      expect(component.selectedAssignee).toBe('all');

      expect(mockTasksFacade.setStatusFilter).toHaveBeenCalledTimes(2);
      expect(mockTasksFacade.setPriorityFilter).toHaveBeenCalledTimes(2);
      expect(mockTasksFacade.setAssigneeFilter).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty assignees list', () => {
      mockTasksFacade.assignees.mockReturnValue([]);
      expect(component.assignees).toEqual([]);
    });

    it('should handle undefined assignees list', () => {
      mockTasksFacade.assignees.mockReturnValue(undefined);
      expect(component.assignees).toBeUndefined();
    });
  });
});
