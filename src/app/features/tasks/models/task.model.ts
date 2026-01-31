import { FormArray, FormControl } from '@angular/forms';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completedAt: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormControls {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  displayedStatus: FormControl<TaskStatus | null>;
  status: FormControl<TaskStatus | null>;
  priority: FormControl<TaskPriority | null>;
  dueDate: FormControl<Date | null>;
  assignee: FormControl<Assignee | null>;
  tags: FormArray<FormControl<string | null>>;
}
