import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { PetService } from '../../../core/services/pet/pet.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TextfieldComponent } from '../../../shared/components/textfield/textfield.component';
import {
  PET_CATEGORIES,
  PET_STATUS_OPTIONS,
  PET_TAGS,
} from '../../../shared/constants/pet.constants';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextfieldComponent,
    AutocompleteComponent,
    ButtonComponent,
  ],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormPage implements OnInit {
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isEditMode = signal(false);
  readonly petId = signal<number | null>(null);
  readonly isMobile = signal(globalThis.innerWidth <= 480);

  readonly categoryOptions = PET_CATEGORIES;
  readonly tagOptions = PET_TAGS;
  readonly statusOptions = PET_STATUS_OPTIONS;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true }),
    tag: new FormControl('', { nonNullable: true }),
    status: new FormControl<'available' | 'pending' | 'sold'>('available', { nonNullable: true }),
  });

  get nameControl(): FormControl {
    return this.form.controls.name;
  }

  get categoryControl(): FormControl {
    return this.form.controls.category;
  }

  get tagControl(): FormControl {
    return this.form.controls.tag;
  }

  get statusControl(): FormControl {
    return this.form.controls.status;
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(globalThis, 'resize')
        .pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const mobile = globalThis.innerWidth <= 480;
          if (this.isMobile() !== mobile) {
            this.ngZone.run(() => this.isMobile.set(mobile));
          }
        });
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = Number(id);
      this.isEditMode.set(true);
      this.petId.set(parsedId);
      this.loadPet(parsedId);
    }
  }

  private loadPet(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.form.patchValue({
          name: pet.name ?? '',
          category: pet.category?.name ?? '',
          tag: pet.tags?.[0]?.name ?? '',
          status: pet.status ?? 'available',
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load pet data.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, category, tag, status } = this.form.getRawValue();
    const currentPetId = this.petId();

    const payload = {
      ...(this.isEditMode() && currentPetId !== null ? { id: currentPetId } : {}),
      name,
      category: { id: 0, name: category },
      tags: [{ id: 0, name: tag }],
      photoUrls: [],
      status,
    };

    this.loading.set(true);
    this.error.set(null);

    if (this.isEditMode()) {
      this.petService.updatePet(payload).subscribe({
        next: () => {
          this.snackbar.show('Pet successfully updated!', 'success');
          this.router.navigate(['/pets'], { queryParams: { status } });
        },
        error: () => {
          this.snackbar.show('Failed to update pet. Please try again.', 'error');
          this.error.set('Failed to update pet. Please try again.');
          this.loading.set(false);
        },
      });
    } else {
      this.petService.createPet(payload).subscribe({
        next: () => {
          this.snackbar.show('Pet successfully added!', 'success');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.snackbar.show('Failed to add pet. Please try again.', 'error');
          this.error.set('Failed to add pet. Please try again.');
          this.loading.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
