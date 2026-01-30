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
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldError } from '../../../../shared/components/field-error/field-error';
import { ValidationService } from '../../../../shared/services/validation.service';

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
  showTagInputValidationMsg: boolean = false;
  readonly task = signal<Task | null>(this.dialogConfig.data?.task || null);
  readonly isEdit = computed(() => !!this.task());
  readonly taskForm = this.fb.group<TaskFormControls>({
    title: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
    description: this.fb.control(null, Validators.required),
    status: this.fb.control({ value: 'todo', disabled: true }, Validators.required),
    priority: this.fb.control(null, Validators.required),
    dueDate: this.fb.control(null, Validators.required),
    assignee: this.fb.control(null, Validators.required),
    tags: this.fb.array<string>([], Validators.required),
  });
  readonly priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  get assignees() {
    return this.tasksFacade.assignees();
  }
  ngOnInit(): void {
    this.validationService.setForm(this.taskForm);
    const task = this.task();
    if (task) {
      this.setDataToForm(task);
    }
  }
  get tags() {
    return this.taskForm.controls.tags;
  }
  onTagInputChange(value: string) {
    if (!value || value.trim() === '') this.showTagInputValidationMsg = true;
    else this.showTagInputValidationMsg = false;
  }
  addTag(tag: string) {
    if (!tag || tag.trim() === '') {
      this.showTagInputValidationMsg = true;
      return;
    }
    this.tags.push(this.fb.control(tag));
  }
  removeTag(index: number) {
    this.tags.removeAt(index);
  }
  private setDataToForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: new Date(task.dueDate),
      assignee: task.assignee,
    });
    this.setTags(task.tags);
  }
  private setTags(tags: string[]) {
    this.tags.clear();
    tags.forEach((tag) => this.tags.push(this.fb.control(tag)));
  }
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
