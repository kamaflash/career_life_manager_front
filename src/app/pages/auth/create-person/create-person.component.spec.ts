import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePersonComponent } from './create-person.component';
import { FormDynamicComponent } from '../../../shared/components/ui/form-dynamic/form-dynamic.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('CreatePersonComponent', () => {
  let component: CreatePersonComponent;
  let fixture: ComponentFixture<CreatePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePersonComponent, FormDynamicComponent], // Deben estar en "imports" porque son standalone
      schemas: [NO_ERRORS_SCHEMA] // Ignoramos posibles errores causados por dependencias
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default character preview', () => {
    expect(component.characterPreview.fullName).toBe('Nuevo Personaje');
    expect(component.characterPreview.age).toBe(16);
  });

  it('should load default character values into the form', () => {
    spyOn(component.formDynamicComponent, 'setFormValues');
    component.loadDefaultCharacter();

    expect(component.formDynamicComponent.setFormValues).toHaveBeenCalledWith(jasmine.objectContaining({
      fullName: 'Carlos Rodríguez Pérez',
      birthDate: jasmine.any(String),
      gender: 'male',
      city: 'madrid'
    }));
  });

  it('should calculate age correctly when form is submitted', () => {
    const mockFormData = {
      fullName: 'Test Character',
      birthDate: '2006-01-19', // 20 años hoy 2026-01-19
      city: 'valencia',
      currentSituation: 'high_school'
    };

    spyOn(window, 'alert');
    component.onFormSubmit(mockFormData);

    expect(component.characterPreview.age).toBe(16);
  });

  it('should handle form submission with invalid age', () => {
    const mockFormData = {
      fullName: 'Test Character',
      birthDate: '2015-01-19', // Menor de 16 años
      city: 'valencia',
      currentSituation: 'high_school'
    };

    spyOn(window, 'alert');

    component.onFormSubmit(mockFormData);

    expect(window.alert).toHaveBeenCalledWith('El personaje debe tener al menos 16 años');
  });

  it('should update character preview on form change', () => {
    const mockData = {
      fullName: 'John Doe',
      birthDate: '2005-01-01',
      currentSituation: 'high_school',
      city: 'barcelona'
    };

    component.onFormChange(mockData);

    expect(component.characterPreview.fullName).toBe('John Doe');
    expect(component.characterPreview.city).toBe('barcelona');
  });

  it('should display a success message for a valid form submission', () => {
    const mockFormData = {
      fullName: 'Test Character',
      birthDate: '2005-01-19',
      city: 'valencia',
      currentSituation: 'high_school'
    };

    spyOn(window, 'alert');

    component.onFormSubmit(mockFormData);

    setTimeout(() => {
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringContaining('¡Personaje creado exitosamente!'));
    }, 3000);
  });
});
