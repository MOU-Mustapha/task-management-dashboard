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

export type CreateTaskPayload = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
