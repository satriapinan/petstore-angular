import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PetService } from '../../core/services/pet/pet.service';
import { DashboardPage } from './dashboard.component';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  const petServiceMock = {
    getPetInventory: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    petServiceMock.getPetInventory.mockReturnValue(of({ available: 5, pending: 2, sold: 10 }));
    routerMock.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        { provide: PetService, useValue: petServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPetInventory on init', () => {
    expect(petServiceMock.getPetInventory).toHaveBeenCalled();
  });

  it('should set inventory data on success', () => {
    expect(component.inventory()).toEqual({
      available: 5,
      pending: 2,
      sold: 10,
    });
  });

  it('should set loading to false after data loaded', () => {
    expect(component.loading()).toBe(false);
  });

  it('should set error on api failure', async () => {
    petServiceMock.getPetInventory.mockReturnValue(throwError(() => new Error('API error')));

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.error()).toBe('Failed to load inventory data.');
    expect(component.loading()).toBe(false);
  });

  it('should navigate to /pets with status query param', () => {
    component.navigateToStatus('available');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets'], {
      queryParams: { status: 'available' },
    });
  });

  it('should navigate to /pets/create', () => {
    component.navigateToAddPet();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets/create']);
  });
});
