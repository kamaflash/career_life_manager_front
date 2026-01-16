import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/auth/register/register.component';

export const routes: Routes = [
  {
    path: 'index',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
];
