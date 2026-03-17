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
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { PetService } from '../../core/services/pet/pet.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PetInventory } from '../../shared/models/inventory.model';

interface InventoryCard {
  label: string;
  key: keyof PetInventory;
  icon: string;
}

const INVENTORY_CARD_STYLE: Record<string, string> = {
  display: 'flex',
  'flex-direction': 'column',
  gap: '8px',
  'align-items': 'flex-start',
};

const DASHBOARD_CARDS: InventoryCard[] = [
  { label: 'Available', key: 'available', icon: '🐾' },
  { label: 'Pending', key: 'pending', icon: '⏳' },
  { label: 'Sold', key: 'sold', icon: '✅' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, SpinnerComponent, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  readonly inventory = signal<PetInventory>({
    available: 0,
    pending: 0,
    sold: 0,
  });
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isMobile = signal(globalThis.innerWidth <= 480);

  readonly cards = DASHBOARD_CARDS;
  readonly inventoryCardStyle = INVENTORY_CARD_STYLE;

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

    this.petService.getPetInventory().subscribe({
      next: (data) => {
        this.inventory.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load inventory data.');
        this.loading.set(false);
      },
    });
  }

  navigateToStatus(status: string): void {
    this.router.navigate(['/pets'], { queryParams: { status } });
  }

  navigateToAddPet(): void {
    this.router.navigate(['/pets/create']);
  }
}
