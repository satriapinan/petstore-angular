import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiError = error.error as ApiResponse;

      console.error('API Error:', apiError?.message || error.message);

      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      return throwError(() => apiError || error);
    }),
  );
};
