import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from '../../../../shared/constants/api.constants';
import { User } from '../../../../shared/models/user.model';
import { AuthApiService } from './auth.api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  const mockUser: User = { username: 'test' } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call login API with GET', () => {
    service.login('test', '123').subscribe();

    const req = httpMock.expectOne((req) => req.url === API.USER.LOGIN);
    expect(req.request.method).toBe('GET');
    req.flush({ code: 200 });
  });

  it('should call getUser API with GET', () => {
    service.getUser('test').subscribe();

    const req = httpMock.expectOne(`${API.USER.GET}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should call register API with POST', () => {
    service.register(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(API.USER.CREATE);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
