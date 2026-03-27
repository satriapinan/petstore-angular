import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PetService } from '../../../core/services/pet/pet.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { PetFormPage } from './pet-form.component';

describe('PetFormPage', () => {
  let component: PetFormPage;
  let fixture: ComponentFixture<PetFormPage>;

  const petServiceMock = {
    createPet: vi.fn(),
    getPetById: vi.fn(),
    updatePet: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: vi.fn().mockReturnValue(null),
      },
    },
  };

  const snackbarServiceMock = {
    show: vi.fn(),
  };

  beforeEach(async () => {
    petServiceMock.createPet.mockReturnValue(of({}));
    routerMock.navigate.mockClear();
    snackbarServiceMock.show.mockClear();

    await TestBed.configureTestingModule({
      imports: [PetFormPage],
      providers: [
        { provide: PetService, useValue: petServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.name).toBe('');
    expect(component.category).toBe('');
    expect(component.tag).toBe('');
    expect(component.status).toBe('available');
  });

  it('should not submit when name is empty', () => {
    component.name = '';
    component.onSubmit();
    expect(petServiceMock.createPet).not.toHaveBeenCalled();
  });

  it('should mark name as touched on invalid submit', () => {
    component.name = '';
    component.onSubmit();
    expect(component.nameTouched).toBe(true);
  });

  it('should call createPet with correct payload', () => {
    component.name = 'Buddy';
    component.category = 'Dogs';
    component.tag = 'Vaccinated';
    component.status = 'available';

    component.onSubmit();

    expect(petServiceMock.createPet).toHaveBeenCalledWith({
      name: 'Buddy',
      category: { id: 0, name: 'Dogs' },
      tags: [{ id: 0, name: 'Vaccinated' }],
      photoUrls: [],
      status: 'available',
    });
  });

  it('should navigate to /dashboard on success', async () => {
    component.name = 'Buddy';
    component.onSubmit();
    await fixture.whenStable();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(snackbarServiceMock.show).toHaveBeenCalledWith('Pet successfully added!', 'success');
  });

  it('should set error on api failure', async () => {
    petServiceMock.createPet.mockReturnValue(throwError(() => new Error('API error')));
    component.name = 'Buddy';
    component.onSubmit();
    await fixture.whenStable();
    expect(component.error()).toBe('Failed to add pet. Please try again.');
    expect(component.loading()).toBe(false);
  });

  it('should navigate to /dashboard on cancel', () => {
    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should have dummy category options', () => {
    expect(component.categoryOptions.length).toBeGreaterThan(0);
  });

  it('should have dummy tag options', () => {
    expect(component.tagOptions.length).toBeGreaterThan(0);
  });

  it('should have available, pending, and sold status options', () => {
    const values = component.statusOptions.map((o) => o.value);
    expect(values).toContain('available');
    expect(values).toContain('pending');
    expect(values).toContain('sold');
  });
});
