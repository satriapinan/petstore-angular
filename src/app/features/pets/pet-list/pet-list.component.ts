import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';

import { AuthService } from '../../../core/services/auth/auth.service';
import { PetService } from '../../../core/services/pet/pet.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { PetStatus } from '../../../shared/enums/pet-status.enum';
import { Pet } from '../../../shared/models/pet.model';

const PET_CARD_STYLE: Record<string, string> = {
  display: 'flex',
  'flex-direction': 'column',
  gap: '8px',
};

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SpinnerComponent,
    ButtonComponent,
    PaginationComponent,
    ConfirmModalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListPage implements OnInit {
  private readonly petService = inject(PetService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly ngZone = inject(NgZone);

  readonly pets = signal<Pet[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activeStatus = signal<string>(PetStatus.AVAILABLE);
  readonly currentPage = signal(1);
  readonly deletingId = signal<number | null>(null);
  readonly isMobile = signal(globalThis.innerWidth <= 480);

  readonly isDeleteModalOpen = signal(false);
  readonly petToDelete = signal<number | null>(null);

  readonly pageSize = 12;
  readonly petCardStyle = PET_CARD_STYLE;
  readonly defaultPhoto = 'https://placehold.co/400x400?text=No+Photo';

  readonly isAdmin = computed(() => this.authService.getCurrentUser()?.username === 'admin');

  readonly pagedPets = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.pets().slice(start, start + this.pageSize);
  });

  readonly statusTabs = [
    {
      label: 'Available',
      value: PetStatus.AVAILABLE,
      icon: 'mdi:paw',
      colorClass: 'text-available',
    },
    {
      label: 'Pending',
      value: PetStatus.PENDING,
      icon: 'mdi:timer-sand',
      colorClass: 'text-pending',
    },
    {
      label: 'Sold',
      value: PetStatus.SOLD,
      icon: 'mdi:check-circle-outline',
      colorClass: 'text-sold',
    },
  ];

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

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const status = this.isAdmin() ? params['status'] || PetStatus.AVAILABLE : PetStatus.AVAILABLE;
      this.activeStatus.set(status);
      this.loadPets(status);
    });
  }

  loadPets(status: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(1);

    this.petService.getPets(status).subscribe({
      next: (data) => {
        this.pets.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load pets.');
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    globalThis.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectStatus(status: string): void {
    if (!this.isAdmin()) return;
    if (this.activeStatus() === status) return;

    this.activeStatus.set(status);
    this.loadPets(status);

    this.router.navigate(['/pets'], { queryParams: { status } });
  }

  getPhotoUrl(photoUrls: string[] | undefined | null): string {
    if (!photoUrls?.length) return this.defaultPhoto;
    const url = photoUrls[0].trim();
    return /^https?:\/\//i.test(url) ? url : this.defaultPhoto;
  }

  navigateToDetail(id: number | undefined): void {
    if (!this.isAdmin()) return;
    if (id !== undefined) {
      this.router.navigate(['/pets/update', id]);
    }
  }

  promptDeletePet(event: Event, id: number | undefined): void {
    event.stopPropagation();
    if (!this.isAdmin()) return;
    if (id !== undefined) {
      this.petToDelete.set(id);
      this.isDeleteModalOpen.set(true);
    }
  }

  confirmDelete(): void {
    const id = this.petToDelete();
    if (id !== null) {
      this.deletingId.set(id);
      this.petService.deletePet(id).subscribe({
        next: () => {
          this.pets.update((pets) => pets.filter((p) => p.id !== id));
          this.snackbar.show('Pet successfully deleted!', 'success');
          this.deletingId.set(null);
          this.closeDeleteModal();
        },
        error: () => {
          this.snackbar.show('Failed to delete pet. Please try again.', 'error');
          this.deletingId.set(null);
          this.closeDeleteModal();
        },
      });
    }
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.petToDelete.set(null);
  }

  navigateToAddPet(): void {
    this.router.navigate(['/pets/create']);
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
