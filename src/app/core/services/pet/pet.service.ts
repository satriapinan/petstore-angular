import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { PetInventory } from '../../../shared/models/inventory.model';
import { Pet } from '../../../shared/models/pet.model';
import { PetApiService } from '../api/pet/pet.api.service';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly petApi = inject(PetApiService);
  private petsCache$?: Observable<Pet[]>;
  private cachedStatus?: string;

  getPetInventory(): Observable<PetInventory> {
    return this.petApi.getPetInventory().pipe(
      map((inventory) => ({
        available: inventory['available'] ?? 0,
        pending: inventory['pending'] ?? 0,
        sold: inventory['sold'] ?? 0,
      })),
    );
  }

  getPets(status = 'available'): Observable<Pet[]> {
    if (this.petsCache$ && this.cachedStatus !== status) {
      this.invalidateCache();
    }

    if (!this.petsCache$) {
      this.cachedStatus = status;
      this.petsCache$ = this.petApi.getPets(status).pipe(shareReplay(1));
    }

    return this.petsCache$;
  }

  getPetById(id: number): Observable<Pet> {
    return this.petApi.getPetById(id);
  }

  createPet(pet: Pet): Observable<Pet> {
    return this.petApi.createPet(pet).pipe(tap(() => this.invalidateCache()));
  }

  updatePet(pet: Pet): Observable<Pet> {
    return this.petApi.updatePet(pet).pipe(tap(() => this.invalidateCache()));
  }

  deletePet(id: number): Observable<void> {
    return this.petApi.deletePet(id).pipe(tap(() => this.invalidateCache()));
  }

  private invalidateCache(): void {
    this.petsCache$ = undefined;
    this.cachedStatus = undefined;
  }
}
