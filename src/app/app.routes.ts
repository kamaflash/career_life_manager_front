import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CreatePersonComponent } from './pages/auth/create-person/create-person.component';
import { ConfirmRegistrationComponent } from './pages/auth/confirm-registration/confirm-registration.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: 'index',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
    ],
  },
  {
    path: 'profile',
    component: PagesComponent,
    children: [
      { path: '', component: ProfileComponent, data: { title: 'Dashboard' } },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'create-person',
    component: CreatePersonComponent,
  },
  {
    path: 'confirm-registration',
    component: ConfirmRegistrationComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
