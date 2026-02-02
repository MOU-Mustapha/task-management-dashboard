import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Task, Assignee } from '../../models/task.model';
import { TaskColumn } from './task-column';
import { TasksFacade } from '../../services/tasks.facade';
import { TaskDialogService } from '../../services/task-dialog.service';

interface MockDragEvent {
  previousContainer: { id: string; data: Task[] };
  container: { id: string; data: Task[] };
  previousIndex: number;
  currentIndex: number;
  item: { data: Task };
  isPointerOverContainer: boolean;
  distance: { x: number; y: number };
  dropPoint: { x: number; y: number };
  event: Event;
}

describe('TaskColumn', () => {
  let component: TaskColumn;
  let fixture: ComponentFixture<TaskColumn>;

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

  const mockTasks: Task[] = [mockTask];

  const mockMultipleTasks: Task[] = [
    mockTask,
    {
      ...mockTask,
      id: '2',
      title: 'Task 2',
    },
    {
      ...mockTask,
      id: '3',
      title: 'Task 3',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColumn, TranslateModule.forRoot()],
      providers: [
        { provide: TasksFacade, useValue: { isTaskOverdue: vi.fn().mockReturnValue(false) } },
        { provide: TaskDialogService, useValue: {} },
        { provide: DialogService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskColumn);
    component = fixture.componentInstance;
    component.title = 'ToDo';
    component.tasks = mockTasks;
    component.columnId = 'column-todo';
    component.connectedIds = ['column-in_progress', 'column-done'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return tasks count', () => {
    expect(component.tasksCount).toBe(1);
    component.tasks = [];
    fixture.detectChanges();
    expect(component.tasksCount).toBe(0);
  });

  it('should handle null/undefined tasks gracefully', () => {
    component.tasks = null as unknown as Task[];
    expect(component.tasksCount).toBe(0);

    component.tasks = undefined as unknown as Task[];
    expect(component.tasksCount).toBe(0);
  });

  describe('dragTask', () => {
    it('should reorder tasks within the same container when indices are different', () => {
      component.tasks = [...mockMultipleTasks]; // Create a copy
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.taskDropped, 'emit');
      const container = { id: 'column-todo', data: component.tasks };
      const mockEvent: MockDragEvent = {
        previousContainer: container,
        container: container,
        previousIndex: 0,
        currentIndex: 2,
        item: { data: component.tasks[0] },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new Event('drop'),
      };

      component.dragTask(mockEvent as CdkDragDrop<Task[]>);

      // Verify the array was reordered
      expect(component.tasks[0]).toEqual(mockMultipleTasks[1]); // Task 2 moved to position 0
      expect(component.tasks[1]).toEqual(mockMultipleTasks[2]); // Task 3 moved to position 1
      expect(component.tasks[2]).toEqual(mockMultipleTasks[0]); // Task 1 moved to position 2
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not reorder tasks when previousIndex equals currentIndex in same container', () => {
      const emitSpy = vi.spyOn(component.taskDropped, 'emit');
      const container = { id: 'column-todo', data: component.tasks };
      const mockEvent: MockDragEvent = {
        previousContainer: container,
        container: container,
        previousIndex: 0,
        currentIndex: 0,
        item: { data: component.tasks[0] },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new Event('drop'),
      };

      component.dragTask(mockEvent as CdkDragDrop<Task[]>);

      // Since previousIndex === currentIndex, array remains unchanged
      expect(component.tasks).toEqual(mockTasks);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit taskDropped when moving between containers', () => {
      const emitSpy = vi.spyOn(component.taskDropped, 'emit');
      const mockEvent: MockDragEvent = {
        previousContainer: { id: 'column-todo', data: mockTasks },
        container: { id: 'column-in_progress', data: [] },
        previousIndex: 0,
        currentIndex: 0,
        item: { data: mockTask },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new Event('drop'),
      };

      component.dragTask(mockEvent as CdkDragDrop<Task[]>);

      expect(emitSpy).toHaveBeenCalledWith({
        previousStatus: 'todo',
        targetStatus: 'in_progress',
        task: mockTask,
        previousIndex: 0,
        currentIndex: 0,
      });
    });

    it('should handle column IDs with hyphen prefix correctly', () => {
      const emitSpy = vi.spyOn(component.taskDropped, 'emit');
      const mockEvent: MockDragEvent = {
        previousContainer: { id: 'column-done', data: mockTasks },
        container: { id: 'column-todo', data: [] },
        previousIndex: 0,
        currentIndex: 0,
        item: { data: mockTask },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: 0, y: 0 },
        event: new Event('drop'),
      };

      component.dragTask(mockEvent as CdkDragDrop<Task[]>);

      expect(emitSpy).toHaveBeenCalledWith({
        previousStatus: 'done',
        targetStatus: 'todo',
        task: mockTask,
        previousIndex: 0,
        currentIndex: 0,
      });
    });
  });
});
