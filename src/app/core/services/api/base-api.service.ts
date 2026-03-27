import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);

  protected get<T>(url: string, params?: HttpParams | Record<string, string>): Observable<T> {
    return this.http.get<T>(url, { params }).pipe(catchError((error) => throwError(() => error)));
  }

  protected post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body).pipe(catchError((error) => throwError(() => error)));
  }

  protected put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body).pipe(catchError((error) => throwError(() => error)));
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(catchError((error) => throwError(() => error)));
  }
}
