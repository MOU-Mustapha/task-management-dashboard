import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskFilter } from '../../components/task-filter/task-filter';
import { TaskBoard } from '../../components/task-board/task-board';
import { TasksFacade } from '../../services/tasks.facade';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskFilter, TaskBoard],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {
  public readonly tasksFacade = inject(TasksFacade);
  // showCreateModal = false;
  // showEditModal = false;
  // editingTask: Task | null = null;
  // onCreateTask(): void {
  //   this.editingTask = null;
  //   this.showCreateModal = true;
  // }
  // onEditTask(task: Task): void {
  //   this.editingTask = task;
  //   this.showEditModal = true;
  // }
  // onDeleteTask(taskId: string): void {
  //   const task = this.tasksFacade.tasks().find((t) => t.id === taskId);
  //   if (!task) return;
  //   if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
  //     this.tasksFacade.delete(taskId).subscribe({
  //       error: (err) => console.error('Failed to delete task:', err),
  //     });
  //   }
  // }
  // onStatusChange(event: { taskId: string; newStatus: TaskStatus }): void {
  //   this.tasksFacade.updateTaskStatus(event.taskId, event.newStatus)?.subscribe({
  //     error: (err) => console.error('Failed to update task status:', err),
  //   });
  // }
  // onSaveTask(taskData: Task): void {
  //   if (this.editingTask) {
  //     const updatedTask: Task = {
  //       ...this.editingTask,
  //       ...taskData,
  //       updatedAt: new Date().toISOString(),
  //     };
  //     this.tasksFacade.update(updatedTask).subscribe({
  //       next: () => this.closeModals(),
  //       error: (err) => console.error('Failed to update task:', err),
  //     });
  //   } else {
  //     const payload: Task = {
  //       ...taskData,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };
  //     this.tasksFacade.create(payload).subscribe({
  //       next: () => this.closeModals(),
  //       error: (err) => console.error('Failed to create task:', err),
  //     });
  //   }
  // }
  // closeModals(): void {
  //   this.showCreateModal = false;
  //   this.showEditModal = false;
  //   this.editingTask = null;
  // }
}
