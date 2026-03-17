import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { API } from '../../../shared/constants/api.constants';
import { User } from '../../../shared/models/user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  const mockUser: User = { username: 'test' } as User;

  beforeEach(() => {
    localStorage.clear();

    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call login API then fetch user and store token', () => {
      service.login('test', '123').subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
      expect(loginReq.request.method).toBe('GET');
      loginReq.flush({ code: 200 });

      const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/test`);
      expect(getUserReq.request.method).toBe('GET');
      getUserReq.flush(mockUser);
    });

    it('should store token in localStorage after login', () => {
      service.login('test', '123').subscribe();

      const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
      loginReq.flush({ code: 200 });

      expect(localStorage.getItem('token')).toBe('fake-token');

      const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/test`);
      getUserReq.flush(mockUser);
    });

    it('should store user in localStorage and update userSubject after login', () => {
      service.login('test', '123').subscribe();

      const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
      loginReq.flush({ code: 200 });

      const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/test`);
      getUserReq.flush(mockUser);

      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should navigate to /pets after login for non-admin user', () => {
      service.login('test', '123').subscribe();

      const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
      loginReq.flush({ code: 200 });

      const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/test`);
      getUserReq.flush(mockUser);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/pets']);
    });

    it('should navigate to /dashboard after login for admin user', () => {
      service.login('admin', '123').subscribe();

      const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
      loginReq.flush({ code: 200 });

      const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/admin`);
      getUserReq.flush({ username: 'admin' });

      expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('register', () => {
    it('should call register API with POST', () => {
      service.register(mockUser).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(API.USER.CREATE);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });

    it('should navigate to /login after successful register', () => {
      service.register(mockUser).subscribe();

      const req = httpMock.expectOne(API.USER.CREATE);
      req.flush(mockUser);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('logout', () => {
    it('should remove token and user from localStorage', () => {
      localStorage.setItem('token', 'test');
      localStorage.setItem('user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should set userSubject to null on logout', () => {
      service.logout();

      expect(service.getCurrentUser()).toBeNull();
    });

    it('should navigate to /login after logout', () => {
      service.logout();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is stored', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return stored user from localStorage on init', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideHttpClientTesting(), { provide: Router, useValue: routerMock }],
      });

      const freshService = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);

      expect(freshService.getCurrentUser()).toEqual(mockUser);
    });
  });

  describe('user$', () => {
    it('should emit updated user after login', () => {
      return new Promise<void>((resolve) => {
        service.user$.subscribe((user) => {
          if (user) {
            expect(user).toEqual(mockUser);
            resolve();
          }
        });

        service.login('test', '123').subscribe();

        const loginReq = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
        loginReq.flush({ code: 200 });

        const getUserReq = httpMock.expectOne((req) => req.url === `${API.USER.GET}/test`);
        getUserReq.flush(mockUser);
      });
    });

    it('should emit null after logout', () => {
      return new Promise<void>((resolve) => {
        const emissions: (User | null)[] = [];

        service.user$.subscribe((user) => {
          emissions.push(user);
          if (emissions.length === 2) {
            expect(emissions[1]).toBeNull();
            resolve();
          }
        });

        service.logout();
      });
    });
  });
});
