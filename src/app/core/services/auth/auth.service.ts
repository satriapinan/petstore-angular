import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthApiService } from '../api/auth/auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly userSubject = new BehaviorSubject<User | null>(this.getStoredUser());

  readonly user$ = this.userSubject.asObservable();

  login(username: string, password: string): Observable<User> {
    return this.authApi.login(username, password).pipe(
      tap(() => {
        localStorage.setItem('token', 'fake-token');
      }),
      switchMap(() => this.authApi.getUser(username)),
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        const destination = username === 'admin' ? '/dashboard' : '/pets';
        this.router.navigate([destination]);
      }),
    );
  }

  register(user: User): Observable<User> {
    return this.authApi.register(user).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
}
