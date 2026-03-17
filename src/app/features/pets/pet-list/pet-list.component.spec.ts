import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PetService } from '../../../core/services/pet/pet.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { PetListPage } from './pet-list.component';

describe('PetListPage', () => {
  let component: PetListPage;
  let fixture: ComponentFixture<PetListPage>;

  const mockPets = [
    { id: 1, name: 'Buddy', photoUrls: [], status: 'available' },
    { id: 2, name: 'Max', photoUrls: [], status: 'available' },
  ];

  const petServiceMock = {
    getPets: vi.fn(),
    deletePet: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const activatedRouteMock = {
    queryParams: of({ status: 'available' }),
  };

  const snackbarServiceMock = {
    show: vi.fn(),
  };

  const authServiceMock = {
    getCurrentUser: vi.fn().mockReturnValue({ username: 'admin' }),
  };

  beforeEach(async () => {
    petServiceMock.getPets.mockReturnValue(of(mockPets));
    petServiceMock.deletePet.mockReturnValue(of({}));

    vi.clearAllMocks();

    routerMock.navigate.mockClear();
    snackbarServiceMock.show.mockClear();
    authServiceMock.getCurrentUser.mockReturnValue({ username: 'admin' });

    await TestBed.configureTestingModule({
      imports: [PetListPage],
      providers: [
        { provide: PetService, useValue: petServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPets with status from query params on init', () => {
    expect(petServiceMock.getPets).toHaveBeenCalledWith('available');
  });

  it('should set pets on success', () => {
    expect(component.pets()).toEqual(mockPets);
  });

  it('should set loading to false after data loaded', () => {
    expect(component.loading()).toBe(false);
  });

  it('should set activeStatus from query param', () => {
    expect(component.activeStatus()).toBe('available');
  });

  it('should set error on api failure', async () => {
    petServiceMock.getPets.mockReturnValue(throwError(() => new Error('API error')));

    fixture = TestBed.createComponent(PetListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.error()).toBe('Failed to load pets.');
    expect(component.loading()).toBe(false);
  });

  it('should navigate to /pets with new status on selectStatus', () => {
    component.selectStatus('pending');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets'], {
      queryParams: { status: 'pending' },
    });
  });

  it('should navigate to pet detail on navigateToDetail', () => {
    component.navigateToDetail(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets/update', 1]);
  });

  it('should not navigate if id is undefined', () => {
    component.navigateToDetail(undefined);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /pets/create on navigateToAddPet', () => {
    component.navigateToAddPet();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets/create']);
  });

  it('should navigate to /dashboard on navigateBack', () => {
    component.navigateBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should open delete modal on promptDeletePet', () => {
    const event = new Event('click');
    component.promptDeletePet(event, 1);

    expect(component.petToDelete()).toBe(1);
    expect(component.isDeleteModalOpen()).toBe(true);
  });

  it('should not open delete modal if id is undefined', () => {
    const event = new Event('click');
    component.promptDeletePet(event, undefined);

    expect(component.petToDelete()).toBeNull();
    expect(component.isDeleteModalOpen()).toBe(false);
  });

  it('should delete pet successfully and update state on confirmDelete', () => {
    component.petToDelete.set(1);
    component.confirmDelete();

    expect(petServiceMock.deletePet).toHaveBeenCalledWith(1);
    expect(component.pets()).toEqual([{ id: 2, name: 'Max', photoUrls: [], status: 'available' }]);
    expect(component.deletingId()).toBe(null);
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(component.petToDelete()).toBeNull();
    expect(snackbarServiceMock.show).toHaveBeenCalledWith('Pet successfully deleted!', 'success');
  });

  it('should handle delete error on confirmDelete', () => {
    petServiceMock.deletePet.mockReturnValue(throwError(() => new Error('Delete error')));

    component.petToDelete.set(1);
    component.confirmDelete();

    expect(petServiceMock.deletePet).toHaveBeenCalledWith(1);
    expect(component.deletingId()).toBe(null);
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(component.petToDelete()).toBeNull();
    expect(snackbarServiceMock.show).toHaveBeenCalledWith(
      'Failed to delete pet. Please try again.',
      'error',
    );
  });

  it('should close modal and reset petToDelete on cancelDelete', () => {
    component.petToDelete.set(1);
    component.isDeleteModalOpen.set(true);

    component.cancelDelete();

    expect(component.petToDelete()).toBeNull();
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(petServiceMock.deletePet).not.toHaveBeenCalled();
  });
});
