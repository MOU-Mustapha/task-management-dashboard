import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

/**
 * Centralized form validation helper service.
 *
 * Responsibilities:
 * - Stores a reference to a FormGroup
 * - Provides a utility method to check if a form control is touched and invalid
 * - Supports nested FormGroups and FormArrays
 *
 * Usage:
 *   validationService.setForm(myFormGroup);
 *   validationService.isFieldValid('controlName');
 */
@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private form!: FormGroup;
  setForm(form: FormGroup) {
    this.form = form;
  }
  /**
   * Checks if a form control is touched and invalid.
   *
   * Handles:
   * - Simple controls on the root form
   * - Controls inside nested FormGroups
   * - Controls inside FormArrays (with optional nested FormGroups)
   *
   * @param ControlName The name of the control to check
   * @param formGroupName Optional: name of the nested FormGroup
   * @param formArrayName Optional: name of the FormArray
   * @param controlIndex Optional: index of the control in the FormArray
   * @returns true if the control is touched and invalid, otherwise false
   */
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
