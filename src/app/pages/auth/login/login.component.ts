import { Component } from '@angular/core';
import { FormDynamicComponent } from "../../../shared/components/ui/form-dynamic/form-dynamic.component";
import { FormConfig } from '../../../core/interfaces';
import { UserService } from '../../../core/services/users/users.service';
import { BaseService } from '../../../core/services/base/base-service.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user';
import { environment } from '../../../../enviroments/environment';
import { SnackService } from '../../../core/services/snack/snack.service';

const endpoint = environment.baseUrlSpring + 'users';

@Component({
  selector: 'app-login',
  imports: [FormDynamicComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading: boolean = false;

  registrationConfig: FormConfig = {
    sections: [
      {
        fields: [
          {
            name: 'email',
            label: 'Correo electrónico',
            type: 'email',
            icon: 'email',
            placeholder: 'ejemplo@email.com',
            required: true,
            fullWidth: true
          },
          {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            icon: 'lock',
            placeholder: '••••••••',
            required: true,
            fullWidth: true
          },
          {
            name: 'submit',
            label: 'Iniciar Sesión',
            type: 'submit-button',
            fullWidth: true,
          }
        ]
      },
    ],
    columns: 2,
    showProgress: false,
    currentStep: 1,
    totalSteps: 1,
    showSocialLogin: true
  };

  constructor(
    private userService: UserService,
    private baseService: BaseService,
    private snack: SnackService,
    private router: Router
  ) {}

  /**
   * Maneja el envío del formulario de login
   */
  onFormSubmit(data: any): void {
    this.isLoading = true;

    const url = `${endpoint}/validate`;
    const loginUser = {
      usernamemail: data.email,
      password: data.password
    };

    this.baseService.postItemSinToken(url, loginUser).subscribe({
      next: (resp:any) => {
        if (resp) {
          this.userService.user = resp as User;
          if(resp.person) {
          this.completeLogin(data, '/index');
          } else {
          this.completeLogin(data, '/create-person');

          }

        } else {
          this.handleLoginError('Credenciales inválidas');
        }
      },
      error: (error) => {
        this.handleLoginError(error.message || 'Error en el servidor');
      }
    });
  }

  /**
   * Completa el proceso de login después de validar credenciales
   */
  private completeLogin(data: any, url:string): void {
    this.userService.login(data).subscribe({
      next: () => {
        this.router.navigate([url]);
      },
      error: (error) => {
        this.handleLoginError(error.message || 'Error al iniciar sesión');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Maneja errores del login
   */
  private handleLoginError(errorMessage: string): void {
    console.error('Error en el login:', errorMessage);
     this.snack.error('Error en el login.');
    this.isLoading = false;

    // Aquí puedes agregar lógica para mostrar mensajes de error al usuario
    // Ejemplo: this.toastService.showError(errorMessage);
  }

  /**
   * Maneja el login con redes sociales
   */
  onSocialLogin(provider: string): void {
    console.log(`Inicio de sesión con ${provider}`);

    // Aquí implementarías la lógica real de login social
    // Ejemplo: this.userService.socialLogin(provider).subscribe(...)

    // Datos de ejemplo para demostración
    const mockSocialData = this.getMockSocialData(provider);
    console.log('Datos de red social:', mockSocialData);
  }

  /**
   * Devuelve datos mock para demostración de login social
   */
  private getMockSocialData(provider: string): any {
    const providers = {
      google: {
        email: 'usuario.google@gmail.com',
        name: 'Usuario Google',
        provider: 'google'
      },
      linkedin: {
        email: 'usuario@linkedin.com',
        name: 'Usuario LinkedIn',
        provider: 'linkedin'
      },
      facebook: {
        email: 'usuario@facebook.com',
        name: 'Usuario Facebook',
        provider: 'facebook'
      }
    };

    return providers[provider as keyof typeof providers] || {};
  }
}
