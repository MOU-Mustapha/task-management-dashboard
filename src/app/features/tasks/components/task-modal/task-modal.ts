import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TasksFacade } from '../../services/tasks.facade';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskFormControls, TaskPriority } from '../../models/task.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldError } from '../../../../shared/components/field-error/field-error';
import { ValidationService } from '../../../../shared/services/validation.service';

/**
 * Task Modal Component
 *
 * Responsibilities:
 * - Displays a modal dialog for creating or editing a Task.
 * - Supports reactive form with validation for Task fields.
 * - Pre-fills form when editing an existing task.
 * - Handles adding and removing tags dynamically.
 * - Maps form values to Task model payload for create/update.
 * - Uses TasksFacade to persist task changes.
 * - Closes modal after submission or cancellation.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
@Component({
  selector: 'app-task-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectModule,
    DatePickerModule,
    FieldError,
  ],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModal implements OnInit {
  private readonly tasksFacade = inject(TasksFacade);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly fb = inject(FormBuilder);
  public readonly validationService = inject(ValidationService);
  private readonly translateService = inject(TranslateService);
  showTagInputValidationMsg: boolean = false;
  readonly task = signal<Task | null>(this.dialogConfig.data?.task || null);
  readonly isEdit = computed(() => !!this.task());
  // Reactive form group for task inputs
  readonly taskForm = this.fb.group<TaskFormControls>({
    title: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
    description: this.fb.control(null, Validators.required),
    displayedStatus: this.fb.control({
      value: this.translateService.instant('todo'),
      disabled: true,
    }),
    status: this.fb.control('todo', Validators.required),
    priority: this.fb.control(null, Validators.required),
    dueDate: this.fb.control(null, Validators.required),
    assignee: this.fb.control(null, Validators.required),
    tags: this.fb.array<string>([], Validators.required),
  });
  // Priority dropdown options
  readonly priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  // Returns list of all assignees from TasksFacade
  get assignees() {
    return this.tasksFacade.assignees();
  }
  ngOnInit(): void {
    this.validationService.setForm(this.taskForm);
    const task = this.task();
    if (task) {
      // initializes the form with task data if editing
      this.setDataToForm(task);
    }
  }
  // Getter for the tags FormArray
  get tags() {
    return this.taskForm.controls.tags;
  }
  /**
   * Adds a tag to the form
   * Shows validation message if tag is empty
   * @param tag string
   */
  addTag(tag: string) {
    if (!tag || tag.trim() === '') {
      this.showTagInputValidationMsg = true;
      return;
    }
    this.tags.push(this.fb.control(tag));
  }
  /**
   * Removes a tag at a given index
   * @param index number
   */
  removeTag(index: number) {
    this.tags.removeAt(index);
  }
  /**
   * Populates the form fields with the task data
   * @param task Task
   */
  private setDataToForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      displayedStatus: this.translateService.instant(task.status),
      status: task.status,
      priority: task.priority,
      dueDate: new Date(task.dueDate),
      assignee: task.assignee,
    });
    this.setTags(task.tags);
  }
  /**
   * Sets the tags FormArray values
   * @param tags string[]
   */
  private setTags(tags: string[]) {
    this.tags.clear();
    tags.forEach((tag) => this.tags.push(this.fb.control(tag)));
  }
  /**
   * Maps the form values to a Task object for create/update
   * @param form ReturnType<typeof this.taskForm.getRawValue>
   * @returns Task
   */
  private mapFormToPayload(form: ReturnType<typeof this.taskForm.getRawValue>): Task {
    const nowDate = new Date().toString();
    return {
      id: this.task()?.id ?? crypto.randomUUID(),
      title: form.title!,
      description: form.description!,
      status: form.status!,
      priority: form.priority!,
      dueDate: new Date(form.dueDate!).toString(),
      assignee: form.assignee!,
      tags: form.tags as string[],
      createdAt: this.task()?.createdAt ?? nowDate,
      updatedAt: this.isEdit() ? nowDate : '',
      completedAt: form.status === 'done' ? nowDate : (this.task()?.completedAt ?? ''),
    };
  }
  /**
   * Submits the form to create or update a task
   * Closes the modal on successful submission
   */
  submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const payload: Task = this.mapFormToPayload(this.taskForm.getRawValue());
    const action = this.isEdit()
      ? this.tasksFacade.update(payload)
      : this.tasksFacade.create(payload);
    action.subscribe(() => this.dialogRef.close(payload));
  }
  closeModal() {
    this.dialogRef.close();
  }
}
