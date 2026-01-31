import { TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let formGroup: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService],
    });
    service = TestBed.inject(ValidationService);

    // Create a test form with various control types
    formGroup = new FormGroup({
      simpleField: new FormControl('', [Validators.required]),
      nestedGroup: new FormGroup({
        nestedField: new FormControl('', [Validators.email]),
        anotherNestedField: new FormControl('', [Validators.minLength(5)]),
      }),
      formArray: new FormArray([
        new FormGroup({
          arrayField1: new FormControl('', [Validators.required]),
          arrayField2: new FormControl('', [Validators.pattern(/^[a-zA-Z]+$/)]),
        }),
        new FormGroup({
          arrayField1: new FormControl('valid', []),
          arrayField2: new FormControl('', [Validators.pattern(/^[a-zA-Z]+$/)]),
        }),
      ]),
    });

    service.setForm(formGroup);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setForm', () => {
    it('should set the form instance', () => {
      const newForm = new FormGroup({
        testField: new FormControl(''),
      });

      service.setForm(newForm);

      // Test that the form was set by checking a field validation
      expect(service.isFieldValid('testField')).toBe(false); // Not touched yet
    });
  });

  describe('isFieldValid - simple field', () => {
    it('should return false for untouched valid field', () => {
      expect(service.isFieldValid('simpleField')).toBe(false);
    });

    it('should return true for touched invalid field', () => {
      const control = formGroup.get('simpleField');
      control?.markAsTouched();
      control?.setValue('');

      expect(service.isFieldValid('simpleField')).toBe(true);
    });

    it('should return false for touched valid field', () => {
      const control = formGroup.get('simpleField');
      control?.markAsTouched();
      control?.setValue('valid value');

      expect(service.isFieldValid('simpleField')).toBe(false);
    });
  });

  describe('isFieldValid - nested group field', () => {
    it('should return false for untouched nested field', () => {
      expect(service.isFieldValid('nestedField', 'nestedGroup')).toBe(false);
    });

    it('should return true for touched invalid nested field', () => {
      const control = formGroup.get('nestedGroup.nestedField');
      control?.markAsTouched();
      control?.setValue('invalid-email');

      expect(service.isFieldValid('nestedField', 'nestedGroup')).toBe(true);
    });

    it('should return false for touched valid nested field', () => {
      const control = formGroup.get('nestedGroup.nestedField');
      control?.markAsTouched();
      control?.setValue('test@example.com');

      expect(service.isFieldValid('nestedField', 'nestedGroup')).toBe(false);
    });

    it('should return false for untouched nested field with minimum length', () => {
      expect(service.isFieldValid('anotherNestedField', 'nestedGroup')).toBe(false);
    });

    it('should return true for touched nested field with insufficient length', () => {
      const control = formGroup.get('nestedGroup.anotherNestedField');
      control?.markAsTouched();
      control?.setValue('abc'); // Less than 5 characters

      expect(service.isFieldValid('anotherNestedField', 'nestedGroup')).toBe(true);
    });

    it('should return false for touched nested field with sufficient length', () => {
      const control = formGroup.get('nestedGroup.anotherNestedField');
      control?.markAsTouched();
      control?.setValue('abcdef'); // More than 5 characters

      expect(service.isFieldValid('anotherNestedField', 'nestedGroup')).toBe(false);
    });
  });

  describe('isFieldValid - form array field', () => {
    it('should return false for untouched form array field', () => {
      expect(service.isFieldValid('arrayField1', undefined, 'formArray', 0)).toBe(false);
    });

    it('should return true for touched invalid form array field', () => {
      const control = formGroup.get('formArray.0.arrayField1');
      control?.markAsTouched();
      control?.setValue('');

      expect(service.isFieldValid('arrayField1', undefined, 'formArray', 0)).toBe(true);
    });

    it('should return false for touched valid form array field', () => {
      const control = formGroup.get('formArray.0.arrayField1');
      control?.markAsTouched();
      control?.setValue('valid value');

      expect(service.isFieldValid('arrayField1', undefined, 'formArray', 0)).toBe(false);
    });

    it('should return false for untouched form array field with pattern validation', () => {
      expect(service.isFieldValid('arrayField2', undefined, 'formArray', 0)).toBe(false);
    });

    it('should return true for touched form array field with invalid pattern', () => {
      const control = formGroup.get('formArray.0.arrayField2');
      control?.markAsTouched();
      control?.setValue('123'); // Numbers don't match pattern

      expect(service.isFieldValid('arrayField2', undefined, 'formArray', 0)).toBe(true);
    });

    it('should return false for touched form array field with valid pattern', () => {
      const control = formGroup.get('formArray.0.arrayField2');
      control?.markAsTouched();
      control?.setValue('validText'); // Matches pattern

      expect(service.isFieldValid('arrayField2', undefined, 'formArray', 0)).toBe(false);
    });

    it('should work with second item in form array', () => {
      const control = formGroup.get('formArray.1.arrayField2');
      control?.markAsTouched();
      control?.setValue('123'); // Numbers don't match pattern

      expect(service.isFieldValid('arrayField2', undefined, 'formArray', 1)).toBe(true);
    });
  });

  describe('isFieldValid - form array item validation', () => {
    it('should return false for untouched form array item', () => {
      expect(service.isFieldValid('', undefined, 'formArray', 0)).toBe(false);
    });

    it('should return true for touched invalid form array item', () => {
      const formArrayControl = formGroup.get('formArray') as FormArray;
      const itemControl = formArrayControl.at(0);
      itemControl.markAsTouched();
      itemControl.setErrors({ required: true });

      expect(service.isFieldValid('', undefined, 'formArray', 0)).toBe(true);
    });

    it('should return false for touched valid form array item', () => {
      const formArrayControl = formGroup.get('formArray') as FormArray;
      const itemControl = formArrayControl.at(1);
      itemControl.markAsTouched();
      itemControl.setErrors(null);

      expect(service.isFieldValid('', undefined, 'formArray', 1)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should throw error for non-existent field', () => {
      expect(() => service.isFieldValid('nonExistentField')).toThrow();
    });

    it('should throw error for non-existent nested group', () => {
      expect(() => service.isFieldValid('nonExistentField', 'nonExistentGroup')).toThrow();
    });

    it('should throw error for non-existent form array', () => {
      expect(() => service.isFieldValid('field', undefined, 'nonExistentArray', 0)).toThrow();
    });

    it('should throw error for out-of-bounds form array index', () => {
      expect(() => service.isFieldValid('field', undefined, 'formArray', 999)).toThrow();
    });

    it('should return false for form array without control name', () => {
      expect(service.isFieldValid('', undefined, 'formArray', 0)).toBe(false);
    });

    it('should throw error for form array with control name but no index', () => {
      expect(() => service.isFieldValid('field', undefined, 'formArray')).toThrow();
    });
  });

  describe('form state changes', () => {
    it('should reflect updated form state after setForm', () => {
      const newForm = new FormGroup({
        newField: new FormControl('', [Validators.required]),
      });

      service.setForm(newForm);
      const control = newForm.get('newField');
      control?.markAsTouched();

      expect(service.isFieldValid('newField')).toBe(true);
    });
  });
});
