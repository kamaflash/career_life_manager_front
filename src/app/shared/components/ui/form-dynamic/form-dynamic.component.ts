import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormConfig,
  FormField,
  PasswordStrength,
} from '../../../../core/interfaces';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-form-dynamic',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-dynamic.component.html',
  styleUrl: './form-dynamic.component.css',
})
export class FormDynamicComponent implements OnInit, OnChanges {
  @Input() config: FormConfig = {
    sections: [],
    columns: 1,
    showProgress: false,
    currentStep: 1,
    totalSteps: 1,
    showSocialLogin: false,
  };

  @Input() initialData: any = {};
  @Input() isLoading: boolean = false;
  @Input() isRegister: boolean = false;
  @Input() isLogin: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formChange = new EventEmitter<any>();
  @Output() socialLogin = new EventEmitter<string>();
  @Output() linkClick = new EventEmitter<FormField>();

  form!: FormGroup;
  passwordStrength: PasswordStrength = {
    score: 0,
    text: 'Introduce contraseña',
    color: 'text-gray-400',
  };

  private difficultyIcons = {
    easy: '😊',
    normal: '😐',
    hard: '😰',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.initializeForm();
    }

    if (changes['initialData'] && this.form) {
      this.patchFormValues();
    }
  }

  private initializeForm(): void {
    const formControls: { [key: string]: any } = {};

    this.config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.name && !field.hidden) {
          const validators = this.getValidators(field);
          const value =
            this.initialData[field.name] || this.getDefaultValue(field);

          // CORREGIDO: Configurar disabled correctamente
          const controlConfig = {
            value: value,
            disabled: field.disabled || false
          };

          formControls[field.name] = [controlConfig, validators];
        }
      });
    });

    this.form = this.fb.group(formControls);

    // Subscribe to form changes
    this.form.valueChanges.subscribe((values) => {
      this.formChange.emit(values);
      this.updatePasswordStrength();
      this.updateConditionalFields();
    });

    // Initial password strength check
    this.updatePasswordStrength();
  }

  private getValidators(field: FormField): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.type === 'number' && field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.type === 'number' && field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    if ((field.type === 'text' || field.type === 'password') && field.min !== undefined) {
      validators.push(Validators.minLength(field.min));
    }

    if ((field.type === 'text' || field.type === 'password') && field.max !== undefined) {
      validators.push(Validators.maxLength(field.max));
    }

    return validators;
  }

  private getDefaultValue(field: FormField): any {
    switch (field.type) {
      case 'difficulty-selector':
        return 'normal';
      case 'checkbox-simple':
        return false;
      default:
        return '';
    }
  }

  private patchFormValues(): void {
    if (this.form && this.initialData) {
      this.form.patchValue(this.initialData, { emitEvent: false });
    }
  }

  // Métodos públicos para la plantilla
  getProgressPercentage(): number {
    if (!this.config.currentStep || !this.config.totalSteps) {
      return 0;
    }
    return Math.round((this.config.currentStep / this.config.totalSteps) * 100);
  }

  // AÑADIDO: Método que falta
  getVisibleFields(fields: FormField[]): FormField[] {
    return fields.filter(field => !field.hidden);
  }

  getInputType(field: FormField): string {
    if (field.type === 'password') {
      return 'password';
    }
    return field.type;
  }

  getStrengthBarClass(index: number): string {
    if (index < this.passwordStrength.score) {
      switch (this.passwordStrength.score) {
        case 1:
          return 'bg-red-500';
        case 2:
          return 'bg-yellow-500';
        case 3:
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-gray-700';
      }
    }
    return 'bg-gray-700';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  isFieldDisabled(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.disabled : false;
  }

  showFieldError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  onFieldChange(field: FormField): void {
    // Trigger validation updates
    const control = this.form.get(field.name);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  selectDifficulty(fieldName: string, value: any): void {
    this.form.get(fieldName)?.setValue(value);
  }

  onLinkClick(field: FormField): void {
    this.linkClick.emit(field);
  }

  onSocialLogin(provider: string): void {
    this.socialLogin.emit(provider);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private updatePasswordStrength(): void {
    const password = this.form.get('password')?.value || '';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    this.passwordStrength.score = score;

    switch (score) {
      case 0:
        this.passwordStrength.text = 'Introduce contraseña';
        this.passwordStrength.color = 'text-gray-400';
        break;
      case 1:
        this.passwordStrength.text = 'Muy débil';
        this.passwordStrength.color = 'text-red-400';
        break;
      case 2:
        this.passwordStrength.text = 'Débil';
        this.passwordStrength.color = 'text-yellow-400';
        break;
      case 3:
        this.passwordStrength.text = 'Buena';
        this.passwordStrength.color = 'text-green-400';
        break;
      case 4:
        this.passwordStrength.text = 'Fuerte';
        this.passwordStrength.color = 'text-green-400';
        break;
    }
  }

  private updateConditionalFields(): void {
    this.config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.showWhen) {
          const dependentValue = this.form.get(field.showWhen.field)?.value;
          field.hidden = !this.evaluateCondition(
            field.showWhen.value,
            dependentValue,
          );
        }
      });
    });
  }

  private evaluateCondition(expected: any, actual: any): boolean {
    if (Array.isArray(expected)) {
      return expected.includes(actual);
    }
    return expected === actual;
  }

  // Métodos para uso externo
  public getFormValue(): any {
    return this.form.value;
  }

  public isValid(): boolean {
    return this.form.valid;
  }

  public resetForm(): void {
    this.form.reset();
    // Restablecer valores por defecto
    this.config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.name) {
          const defaultValue = this.getDefaultValue(field);
          this.form.get(field.name)?.setValue(defaultValue);
        }
      });
    });
  }

  public updateFieldValue(fieldName: string, value: any): void {
    this.form.get(fieldName)?.setValue(value);
  }

  public enableField(fieldName: string): void {
    const control = this.form.get(fieldName);
    if (control) {
      control.enable();
    }
  }

  public disableField(fieldName: string): void {
    const control = this.form.get(fieldName);
    if (control) {
      control.disable();
    }
  }

  getFieldContainerClasses(field: FormField): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'form-field': true,
      'w-full': field.fullWidth || this.config.columns === 1,
      'col-span-1': !field.fullWidth && this.config.columns! > 1,
    };

    // Si es fullWidth o grid, ocupa todas las columnas
    if (field.fullWidth || field.grid) {
      if (this.config.columns === 2) {
        classes['col-span-2'] = true;
      } else if (this.config.columns === 3) {
        classes['col-span-3'] = true;
      }
    }

    return classes;
  }
 // Método público para setear valor de un campo
  setFieldValue(fieldName: string, value: any): void {
    if (this.form.get(fieldName)) {
      this.form.get(fieldName)?.setValue(value);
      // Disparar el evento de cambio si es necesario
      const field = this.findFieldByName(fieldName);
      if (field) {
        this.onFieldChange(field);
      }
    }
  }

  // Método público para setear valores múltiples
  setFormValues(values: { [key: string]: any }): void {
    this.form.patchValue(values);

    // Disparar eventos de cambio para cada campo
    Object.keys(values).forEach(fieldName => {
      const field = this.findFieldByName(fieldName);
      if (field) {
        this.onFieldChange(field);
      }
    });
  }

  // Método público para obtener el formulario
  getForm(): any {
    return this.form;
  }

  // Método público para obtener valor específico
  getFieldValue(fieldName: string): any {
    return this.form.get(fieldName)?.value;
  }

  // Método público para resetear con valores específicos
  resetFormWithValues(values: { [key: string]: any }): void {
    this.form.reset(values);
  }

  // Método público para habilitar/deshabilitar campo
  setFieldDisabled(fieldName: string, disabled: boolean): void {
    if (disabled) {
      this.form.get(fieldName)?.disable();
    } else {
      this.form.get(fieldName)?.enable();
    }
  }

  // Helper para encontrar campo por nombre
  private findFieldByName(fieldName: string): any {
    for (const section of this.config.sections) {
      const field = section.fields.find((f: any) => f.name === fieldName);
      if (field) return field;
    }
    return null;
  }
// En form-dynamic.component.ts

// Método para verificar si una opción está seleccionada
isOptionChecked(fieldName: string, optionValue: string): boolean {
  const value = this.form.get(fieldName)?.value;
  if (Array.isArray(value)) {
    return value.includes(optionValue);
  }
  return value === optionValue || value === true;
}

// Método para alternar checkbox
toggleCheckbox(field: any, optionValue: string): void {
  const currentValue = this.form.get(field.name)?.value || [];
  let newValue: any[] = [];

  if (Array.isArray(currentValue)) {
    // Si ya está seleccionado, quitarlo
    if (currentValue.includes(optionValue)) {
      newValue = currentValue.filter((v: string) => v !== optionValue);
    } else {
      // Si no está seleccionado y hay límite máximo
      if (field.maxSelections && currentValue.length >= field.maxSelections) {
        // Mostrar mensaje de error
        this.showMaxSelectionsError(field);
        return;
      }
      newValue = [...currentValue, optionValue];
    }
  } else {
    // Si no es array, iniciar uno nuevo
    newValue = [optionValue];
  }

  // Actualizar el valor en el formulario
  this.form.get(field.name)?.setValue(newValue);

  // Validar después de cambiar
  this.validateCheckboxGroup(field, newValue);

  // Disparar evento de cambio
  this.onFieldChange(field);
}

// Método para verificar si un checkbox está deshabilitado
isCheckboxDisabled(field: any, optionValue: string): boolean {
  const currentValue = this.form.get(field.name)?.value || [];

  // Si hay un límite máximo y ya se alcanzó, deshabilitar opciones no seleccionadas
  if (field.maxSelections && Array.isArray(currentValue)) {
    if (currentValue.length >= field.maxSelections && !currentValue.includes(optionValue)) {
      return true;
    }
  }

  return false;
}

// Método para mostrar error de máximo seleccionado
showMaxSelectionsError(field: any): void {
  // Puedes implementar una notificación o alerta aquí
  console.warn(`Máximo ${field.maxSelections} opciones permitidas para ${field.label}`);

  // Opcional: Mostrar mensaje temporal
  const errorElement = document.querySelector(`#${field.name}-max-error`);
  if (errorElement) {
    errorElement.classList.remove('hidden');
    setTimeout(() => {
      errorElement.classList.add('hidden');
    }, 3000);
  }
}

// Método para obtener el conteo de selecciones
getSelectedCount(fieldName: string): number {
  const value = this.form.get(fieldName)?.value;
  if (Array.isArray(value)) {
    return value.length;
  }
  return value ? 1 : 0;
}

// Método para limpiar todos los checkboxes
clearCheckboxes(fieldName: string): void {
  this.form.get(fieldName)?.setValue([]);

  // Encontrar el campo y disparar evento de cambio
  const field = this.findFieldByName(fieldName);
  if (field) {
    this.onFieldChange(field);
  }
}

// Método para validar el grupo de checkboxes
validateCheckboxGroup(field: any, value: any[]): void {
  const errors: any = {};

  // Validar requerido
  if (field.required && (!Array.isArray(value) || value.length === 0)) {
    errors['required'] = true;
  }

  // Validar máximo selecciones
  if (field.maxSelections && Array.isArray(value) && value.length > field.maxSelections) {
    errors['maxSelections'] = true;
  }

  // Aplicar errores al control
  if (Object.keys(errors).length > 0) {
    this.form.get(field.name)?.setErrors(errors);
  } else {
    this.form.get(field.name)?.setErrors(null);
  }
}

}
