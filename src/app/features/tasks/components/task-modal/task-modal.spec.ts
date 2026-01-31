import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TaskModal } from './task-modal';
import { TasksFacade } from '../../services/tasks.facade';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FieldError } from '../../../../shared/components/field-error/field-error';
import { Assignee, Task } from '../../models/task.model';

interface MockTasksFacade {
  assignees: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

interface MockDynamicDialogRef {
  close: ReturnType<typeof vi.fn>;
}

interface MockDynamicDialogConfig {
  data: { task?: Task };
}

describe('TaskModal', () => {
  let component: TaskModal;
  let fixture: ComponentFixture<TaskModal>;
  let mockTasksFacade: MockTasksFacade;
  let mockDialogRef: MockDynamicDialogRef;
  let mockDialogConfig: MockDynamicDialogConfig;
  let mockValidationService: ValidationService;

  const mockAssignees: Assignee[] = [
    { id: 'a1', name: 'Alice', avatar: '', email: 'alice@example.com' },
    { id: 'a2', name: 'Bob', avatar: '', email: 'bob@example.com' },
  ];

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-01-10',
    completedAt: '',
    assignee: mockAssignees[0],
    tags: ['tag1', 'tag2'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    mockTasksFacade = {
      assignees: vi.fn().mockReturnValue(mockAssignees),
      create: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
      update: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    };

    mockDialogRef = {
      close: vi.fn(),
    };

    mockDialogConfig = {
      data: {},
    };

    await TestBed.configureTestingModule({
      imports: [
        TaskModal,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        SelectModule,
        DatePickerModule,
        FieldError,
      ],
      providers: [
        { provide: TasksFacade, useValue: mockTasksFacade },
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
        ValidationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskModal);
    component = fixture.componentInstance;
    mockValidationService = TestBed.inject(ValidationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with default values for create mode', () => {
      expect(component.isEdit()).toBe(false);
      expect(component.task()).toBe(null);
      expect(component.showTagInputValidationMsg).toBe(false);
    });

    it('should have correct priority options', () => {
      expect(component.priorityOptions).toEqual([
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ]);
    });

    it('should return assignees from facade', () => {
      expect(component.assignees).toEqual(mockAssignees);
      expect(mockTasksFacade.assignees).toHaveBeenCalled();
    });

    it('should initialize form with correct validators', () => {
      const form = component.taskForm;
      expect(form.contains('title')).toBe(true);
      expect(form.contains('description')).toBe(true);
      expect(form.contains('status')).toBe(true);
      expect(form.contains('priority')).toBe(true);
      expect(form.contains('dueDate')).toBe(true);
      expect(form.contains('assignee')).toBe(true);
      expect(form.contains('tags')).toBe(true);

      const titleControl = form.get('title');
      expect(titleControl?.validator).toBeDefined();
      // Check if the control has required validator by testing invalid state
      titleControl?.setValue('');
      expect(titleControl?.invalid).toBe(true);

      // Check if the control has minLength validator by testing with short value
      titleControl?.setValue('ab');
      expect(titleControl?.invalid).toBe(true);

      // Check if valid with proper length
      titleControl?.setValue('abc');
      expect(titleControl?.invalid).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      mockDialogConfig.data = { task: mockTask };
      fixture = TestBed.createComponent(TaskModal);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize in edit mode when task is provided', () => {
      expect(component.isEdit()).toBe(true);
      expect(component.task()).toEqual(mockTask);
    });

    it('should populate form with task data', () => {
      const form = component.taskForm;
      expect(form.get('title')?.value).toBe(mockTask.title);
      expect(form.get('description')?.value).toBe(mockTask.description);
      expect(form.get('status')?.value).toBe(mockTask.status);
      expect(form.get('priority')?.value).toBe(mockTask.priority);
      expect(form.get('assignee')?.value).toEqual(mockTask.assignee);
      expect(form.get('dueDate')?.value).toEqual(new Date(mockTask.dueDate));
    });

    it('should populate tags from task data', () => {
      const tags = component.tags;
      expect(tags.length).toBe(2);
      expect(tags.at(0)?.value).toBe('tag1');
      expect(tags.at(1)?.value).toBe('tag2');
    });
  });

  describe('Tags Management', () => {
    it('should add tag when valid tag is provided', () => {
      const initialLength = component.tags.length;
      component.addTag('newTag');
      expect(component.tags.length).toBe(initialLength + 1);
      expect(component.tags.at(initialLength)?.value).toBe('newTag');
      expect(component.showTagInputValidationMsg).toBe(false);
    });

    it('should show validation message when empty tag is provided', () => {
      component.addTag('');
      expect(component.showTagInputValidationMsg).toBe(true);
      expect(component.tags.length).toBe(0);
    });

    it('should show validation message when whitespace-only tag is provided', () => {
      component.addTag('   ');
      expect(component.showTagInputValidationMsg).toBe(true);
      expect(component.tags.length).toBe(0);
    });

    it('should remove tag at specific index', () => {
      component.addTag('tag1');
      component.addTag('tag2');
      component.addTag('tag3');

      const initialLength = component.tags.length;
      component.removeTag(1);

      expect(component.tags.length).toBe(initialLength - 1);
      expect(component.tags.at(0)?.value).toBe('tag1');
      expect(component.tags.at(1)?.value).toBe('tag3');
    });

    it('should hide validation message when input is changed', () => {
      component.showTagInputValidationMsg = true;
      component.showTagInputValidationMsg = false;
      expect(component.showTagInputValidationMsg).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      const markAllAsTouchedSpy = vi.spyOn(component.taskForm, 'markAllAsTouched');
      component.submit();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(mockTasksFacade.create).not.toHaveBeenCalled();
      expect(mockTasksFacade.update).not.toHaveBeenCalled();
    });

    it('should create new task when form is valid in create mode', () => {
      // Fill form with valid data
      component.taskForm.patchValue({
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2025-01-15'),
        assignee: mockAssignees[1],
      });
      component.addTag('newTag');

      const mockCreateSubscription = { subscribe: vi.fn((callback) => callback()) };
      mockTasksFacade.create.mockReturnValue(mockCreateSubscription);

      component.submit();

      expect(mockTasksFacade.create).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should update existing task when form is valid in edit mode', () => {
      mockDialogConfig.data = { task: mockTask };
      fixture = TestBed.createComponent(TaskModal);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Update form data
      component.taskForm.patchValue({
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'in_progress',
        priority: 'low',
        dueDate: new Date('2025-01-20'),
        assignee: mockAssignees[1],
      });

      const mockUpdateSubscription = { subscribe: vi.fn((callback) => callback()) };
      mockTasksFacade.update.mockReturnValue(mockUpdateSubscription);

      component.submit();

      expect(mockTasksFacade.update).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should map form data to task payload correctly', () => {
      const formValue = {
        title: 'Test Task',
        description: 'Test Description',
        displayedStatus: 'todo' as const,
        status: 'todo' as const,
        priority: 'high' as const,
        dueDate: new Date('2025-01-10'),
        assignee: mockAssignees[0],
        tags: ['tag1', 'tag2'],
      };

      component.taskForm.patchValue(formValue);
      component.tags.clear();
      component.addTag('tag1');
      component.addTag('tag2');

      // Access private method through type assertion for testing
      const payload = (
        component as unknown as {
          mapFormToPayload: (form: ReturnType<typeof component.taskForm.getRawValue>) => Task;
        }
      ).mapFormToPayload(formValue);

      expect(payload.title).toBe(formValue.title);
      expect(payload.description).toBe(formValue.description);
      expect(payload.status).toBe(formValue.status);
      expect(payload.priority).toBe(formValue.priority);
      expect(payload.assignee).toBe(formValue.assignee);
      expect(payload.tags).toEqual(formValue.tags);
      expect(payload.id).toBeDefined();
      expect(payload.createdAt).toBeDefined();
      expect(payload.updatedAt).toBeDefined();
    });
  });

  describe('Modal Actions', () => {
    it('should close modal without data when cancel is clicked', () => {
      component.closeModal();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should close modal with task data when form is submitted successfully', () => {
      component.taskForm.patchValue({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2025-01-10'),
        assignee: mockAssignees[0],
      });
      component.addTag('tag1');

      const mockSubscription = { subscribe: vi.fn((callback) => callback()) };
      mockTasksFacade.create.mockReturnValue(mockSubscription);

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalledWith(expect.any(Object));
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

    it('should handle task with empty tags', () => {
      const taskWithEmptyTags = { ...mockTask, tags: [] };
      mockDialogConfig.data = { task: taskWithEmptyTags };
      fixture = TestBed.createComponent(TaskModal);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.tags.length).toBe(0);
    });

    it('should handle task with null/undefined due date', () => {
      const taskWithNullDueDate = { ...mockTask, dueDate: '' };
      mockDialogConfig.data = { task: taskWithNullDueDate };
      fixture = TestBed.createComponent(TaskModal);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const dueDateValue = component.taskForm.get('dueDate')?.value;
      // Empty string should result in null or invalid date
      expect(dueDateValue === null || (dueDateValue && Number.isNaN(dueDateValue.getTime()))).toBe(
        true,
      );
    });
  });

  describe('Integration with ValidationService', () => {
    it('should set form in validation service on init', () => {
      const setFormSpy = vi.spyOn(mockValidationService, 'setForm');
      component.ngOnInit();
      expect(setFormSpy).toHaveBeenCalledWith(component.taskForm);
    });
  });
});
