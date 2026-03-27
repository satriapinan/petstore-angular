import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RegisterPage } from './register.component';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  const authMock = {
    register: vi.fn().mockReturnValue(of({ username: 'test' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [{ provide: AuthService, useValue: authMock }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register', () => {
    component.username = 'test';
    component.password = 'test123';
    component.confirmPassword = 'test123';
    component.submit();
    expect(authMock.register).toHaveBeenCalledWith({ username: 'test', password: 'test123' });
  });

  it('should not submit when passwords do not match', () => {
    authMock.register.mockClear();
    component.username = 'test';
    component.password = 'test123';
    component.confirmPassword = 'different';
    component.submit();
    expect(authMock.register).not.toHaveBeenCalled();
  });
});
