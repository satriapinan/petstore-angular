import { inject } from '@angular/core';
import { CanMatchFn, Route } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const roleGuard: CanMatchFn = (route: Route) => {
  const authService = inject(AuthService);

  const expectedRole = route.data?.['role'];
  const user = authService.getCurrentUser();

  return user?.username === expectedRole;
};
