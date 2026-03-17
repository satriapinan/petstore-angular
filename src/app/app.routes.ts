import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { guestGuard } from './core/guards/guest/guest.guard';
import { roleGuard } from './core/guards/role/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { role: 'admin' },
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardPage),
  },
  {
    path: 'pets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pets/pet-list/pet-list.component').then((m) => m.PetListPage),
  },
  {
    path: 'pets/create',
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { role: 'admin' },
    loadComponent: () =>
      import('./features/pets/pet-form/pet-form.component').then((m) => m.PetFormPage),
  },
  {
    path: 'pets/update/:id',
    canActivate: [authGuard],
    canMatch: [roleGuard],
    data: { role: 'admin' },
    loadComponent: () =>
      import('./features/pets/pet-form/pet-form.component').then((m) => m.PetFormPage),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
