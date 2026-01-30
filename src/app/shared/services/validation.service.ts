import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private form!: FormGroup;
  setForm(form: FormGroup) {
    this.form = form;
  }
  isFieldValid(
    ControlName: string,
    formGroupName?: string,
    formArrayName?: string,
    controlIndex?: number,
  ): boolean {
    if (formArrayName !== undefined && controlIndex !== undefined) {
      if (ControlName) {
        const formGroup = (this.form.get(formArrayName) as FormArray).controls[
          controlIndex
        ] as FormGroup;
        return formGroup.controls[ControlName].touched && formGroup.controls[ControlName].invalid;
      } else {
        const formArray = (this.form.get(formArrayName) as FormArray).controls;
        return formArray[controlIndex].touched && formArray[controlIndex].invalid;
      }
    } else if (formGroupName) {
      return (
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName].touched &&
        (this.form.controls[formGroupName] as FormGroup).controls[ControlName].invalid
      );
    } else {
      return this.form.controls[ControlName].touched && this.form.controls[ControlName].invalid;
    }
  }
}
