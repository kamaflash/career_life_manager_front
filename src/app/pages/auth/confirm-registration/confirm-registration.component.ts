import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/users/users.service';
import { BaseService } from '../../../core/services/base/base-service.service';
import { environment } from '../../../../enviroments/environment';
import { CommonModule } from '@angular/common';
const endpoint = environment.baseUrlSpring + 'users';

@Component({
  selector: 'app-confirm-registration',
  imports: [CommonModule],
  templateUrl: './confirm-registration.component.html',
  styleUrl: './confirm-registration.component.css'
})
export class ConfirmRegistrationComponent {
token: string = '';
  isLoading: boolean = true;
  isConfirmed: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  userName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private baseService: BaseService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const uid = params['uid'];

      if (!uid) {
        this.error = true;
        this.errorMessage = 'Token de verificación no válido o no proporcionado.';
        this.isLoading = false;
        return;
      }

      this.confirmUser();
    });
  }

  confirmUser(): void {
    this.isLoading = true;
    this.error = false;
    const url = endpoint + `/activate?uid=${this.route.snapshot.queryParams['uid']}`;
    const urlGet = endpoint + `/fulluser/${this.route.snapshot.queryParams['uid']}`;
    const urlPut = endpoint + `/${this.route.snapshot.queryParams['uid']}`;
    // Llamada al servicio para confirmar el usuario
    this.baseService.getItems(urlGet).subscribe({
      next: async (response: any) => {
        this.userName = response.username || 'Usuario';

        // Guardar token de autenticación si viene en la respuesta
        if (response) {
          let user = response
          user.status = true;
          await this.baseService.putItem(urlPut, user).subscribe();
          this.userService.user = response;
          const formData = {
            usernamemail: response.email,
            password: response.password
          };
          await this.userService.login(formData).subscribe(
            () => {
              this.isConfirmed = true;

              setTimeout(() => {
              this.isLoading = false;
                this.router.navigate(['/index']);
              }, 3000);
            }
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = true;

        switch (error.status) {
          case 400:
            this.errorMessage = 'Token inválido o malformado.';
            break;
          case 404:
            this.errorMessage = 'El enlace de verificación no fue encontrado.';
            break;
          case 410:
            this.errorMessage = 'El enlace de verificación ha expirado.';
            break;
          case 409:
            this.errorMessage = 'La cuenta ya ha sido verificada anteriormente.';
            break;
          default:
            this.errorMessage = 'Ha ocurrido un error al verificar tu cuenta. Por favor, intenta nuevamente.';
        }
      }
    });
  }

  resendVerification(): void {
    this.isLoading = true;
    // Aquí implementarías la lógica para reenviar el correo
    // this.userService.resendVerification(this.token).subscribe(...)
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToTutorial(): void {
    this.router.navigate(['/tutorial']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
