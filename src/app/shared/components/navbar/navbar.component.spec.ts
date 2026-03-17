import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NavbarLayout } from './navbar.component';

describe('NavbarLayout', () => {
  let component: NavbarLayout;
  let fixture: ComponentFixture<NavbarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLayout],
      providers: [
        {
          provide: AuthService,
          useValue: { user$: of(null), logout: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarLayout);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return first letter uppercase', () => {
    const result = component.getInitial('satria');
    expect(result).toBe('S');
  });

  it('should return empty string if username is empty', () => {
    const result = component.getInitial('');
    expect(result).toBe('');
  });
});
