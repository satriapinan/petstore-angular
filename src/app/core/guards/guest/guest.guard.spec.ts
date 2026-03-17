import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthService } from '../../services/auth/auth.service';
import { guestGuard } from './guest.guard';

const mockActivatedRoute = {} as ActivatedRouteSnapshot;
const mockRouterState = {} as RouterStateSnapshot;

describe('guestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  let authServiceMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authServiceMock }],
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user is NOT authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const result = executeGuard(mockActivatedRoute, mockRouterState);

    expect(result).toBe(true);
  });

  it('should redirect to /dashboard when admin is already authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getCurrentUser.mockReturnValue({ username: 'admin' });

    const result = executeGuard(mockActivatedRoute, mockRouterState) as UrlTree;
    const expectedTree = router.createUrlTree(['/dashboard']);

    expect(result.toString()).toBe(expectedTree.toString());
  });

  it('should redirect to /pets when non-admin user is already authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.getCurrentUser.mockReturnValue({ username: 'john' });

    const result = executeGuard(mockActivatedRoute, mockRouterState) as UrlTree;
    const expectedTree = router.createUrlTree(['/pets']);

    expect(result.toString()).toBe(expectedTree.toString());
  });
});
