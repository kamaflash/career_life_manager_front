import { Component, ViewChild } from '@angular/core';
import { FormConfig } from '../../../core/interfaces';
import { FormDynamicComponent } from '../../../shared/components/ui/form-dynamic/form-dynamic.component';
import { BaseService } from '../../../core/services/base/base-service.service';
import { UserService } from '../../../core/services/users/users.service';
import { environment } from '../../../../enviroments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
const endpoint = environment.baseUrlSpring + 'users';

@Component({
  selector: 'app-register',
  imports: [FormDynamicComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoading: boolean = false;

  // Referencia al formulario dinámico
  @ViewChild(FormDynamicComponent) formDynamicComponent!: FormDynamicComponent;

  registrationConfig: FormConfig = {
    sections: [
      {
        title: 'Datos de Cuenta',
        icon: '🔐',
        description: 'Crea tu acceso al juego',
        fields: [
          {
            name: 'email',
            label: 'Correo electrónico',
            type: 'email',
            icon: '📧',
            placeholder: 'ejemplo@email.com',
            required: true,
            fullWidth: true,
          },
          {
            name: 'username',
            label: 'Nombre de usuario',
            type: 'text',
            icon: '👤',
            placeholder: 'miusuario123',
            required: true,
            fullWidth: true,
            min: 3,
            max: 20,
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            icon: '🔒',
            placeholder: '••••••••',
            required: true,
            fullWidth: true,
            min: 8,
            showStrength: true,
          },
          {
            name: 'confirmPassword',
            label: 'Confirmar contraseña',
            type: 'password',
            icon: '🔒',
            placeholder: '••••••••',
            required: true,
            fullWidth: true,
          },
          {
            name: 'email',
            label: 'Crear cuenta',
            type: 'submit-button',
            icon: '📧',
            fullWidth: true,
          },
        ],
      },
    ],
    columns: 2,
    showProgress: true,
    currentStep: 1,
    totalSteps: 3,
    showSocialLogin: true,
  };

  //Comprueba si se ha enviado el mail
  sendMail: boolean = false;
  constructor(
    private baseService: BaseService,
    private userService: UserService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    // Ejemplo de inicialización con datos
    setTimeout(() => {
      if (this.formDynamicComponent) {
        this.loadSampleData();
      }
    }, 100);
  }

  // Helper para obtener fecha actual en formato YYYY-MM-DD
  private getTodayFormatted(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Ejemplo 1: Cargar datos de muestra
  loadSampleData(): void {
    const sampleData = {
      email: 'ejemplo@email.com',
      username: 'jugador123',
      fullName: 'Juan Pérez',
      birthDate: '1990-05-15', // Formato YYYY-MM-DD para tipo date
      gender: 'male',
      phone: '+34 612 345 678',
      characterName: 'DragónDorado',
      difficulty: 'normal',
      terms: true,
      newsletter: true,
    };

    this.formDynamicComponent.setFormValues(sampleData);
  }

  // Ejemplo 2: Cargar datos desde API
  loadUserDataFromAPI(): void {
    // Simulación de llamada a API
    this.isLoading = true;

    // Ejemplo ficticio
    setTimeout(() => {
      const userData = {
        email: 'usuario@registrado.com',
        username: 'usuario_existente',
        fullName: 'María González',
        birthDate: '1985-08-22',
        gender: 'female',
        // etc...
      };

      this.formDynamicComponent.setFormValues(userData);
      this.isLoading = false;
    }, 1000);
  }

  // Ejemplo 3: Setear un campo individual
  fillWithTestUser(): void {
    this.formDynamicComponent.setFieldValue('email', 'test@ejemplo.com');
    this.formDynamicComponent.setFieldValue('username', 'test_user');
    this.formDynamicComponent.setFieldValue('fullName', 'Usuario de Prueba');

    // Para fecha
    this.formDynamicComponent.setFieldValue('birthDate', '1995-12-25');

    // Para select
    this.formDynamicComponent.setFieldValue('gender', 'nonbinary');

    // Para difficulty-selector
    this.formDynamicComponent.setFieldValue('difficulty', 'easy');

    // Para checkboxes
    this.formDynamicComponent.setFieldValue('terms', true);
    this.formDynamicComponent.setFieldValue('newsletter', false);
  }

  // Ejemplo 4: Resetear formulario con valores por defecto
  resetWithDefaults(): void {
    const defaults = {
      difficulty: 'normal',
      newsletter: true,
    };
    this.formDynamicComponent.resetFormWithValues(defaults);
  }

  // Ejemplo 5: Manipular campos dinámicamente
  togglePhoneField(): void {
    // Suponiendo que quieres habilitar/deshabilitar el campo de teléfono
    const isDisabled = this.formDynamicComponent
      .getForm()
      .get('phone')?.disabled;
    this.formDynamicComponent.setFieldDisabled('phone', !isDisabled);
  }

  // Ejemplo 6: Obtener valores del formulario
  logFormValues(): void {
    const formData = this.formDynamicComponent.getForm().value;
    console.log('Valores del formulario:', formData);

    // Obtener un valor específico
    const username = this.formDynamicComponent.getFieldValue('username');
    console.log('Username:', username);
  }

  // Ejemplo 7: Prellenar con datos de registro social
  prefillFromSocialLogin(socialData: any): void {
    const socialMappings = {
      google: {
        email: socialData.email,
        fullName: socialData.name,
        username: this.generateUsername(socialData.email),
        // Puedes mapear más campos según lo que devuelva cada proveedor
      },
      linkedin: {
        email: socialData.emailAddress,
        fullName: `${socialData.firstName} ${socialData.lastName}`,
        username: this.generateUsername(socialData.emailAddress),
        phone: socialData.phoneNumber,
      },
      // etc...
    };

    // Aplicar los mapeos según el proveedor
    this.formDynamicComponent.setFormValues(socialMappings['google']);
  }

  private generateUsername(email: string): string {
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
  }

  // Event handlers del formulario
  onFormSubmit(data: any): void {
    console.log('Formulario enviado:', data);
    this.isLoading = true;

    this.baseService.postItemSinToken(endpoint, data).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        setTimeout(() => {
          console.log('Registro exitoso!', data);
          this.isLoading = false;
          this.sendMail = true;
          // Opcional: resetear formulario después de éxito
          // this.formDynamicComponent.resetForm();
        }, 2000);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
      },
      complete: () => {
        // Opcional: lógica al completar la solicitud
        this.isLoading = false;
      },
    });
  }

  onSocialLogin(provider: string): void {
    console.log('Inicio de sesión social con:', provider);

    // Simulación de datos de red social
    const mockSocialData = {
      google: {
        email: 'usuario.google@gmail.com',
        name: 'Usuario Google',
        emailAddress: 'usuario.google@gmail.com',
      },
      linkedin: {
        emailAddress: 'usuario@linkedin.com',
        firstName: 'Usuario',
        lastName: 'LinkedIn',
      },
    };

    this.prefillFromSocialLogin(
      mockSocialData[provider as keyof typeof mockSocialData],
    );
  }

  // Método para ser llamado desde el template si quieres botones de prueba
  loadExample1(): void {
    this.loadSampleData();
  }

  loadExample2(): void {
    this.fillWithTestUser();
  }

  clearForm(): void {
    this.formDynamicComponent.resetForm();
  }
}
