import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../../../shared/constants/api.constants';
import { Pet } from '../../../../shared/models/pet.model';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root',
})
export class PetApiService extends BaseApiService {
  getPetInventory(): Observable<Record<string, number>> {
    return this.get<Record<string, number>>(API.STORE.INVENTORY);
  }

  getPets(status: string): Observable<Pet[]> {
    const params = new HttpParams().set('status', status);
    return this.get<Pet[]>(API.PET.FIND_BY_STATUS, params);
  }

  getPetById(id: number): Observable<Pet> {
    return this.get<Pet>(`${API.PET.GET}/${id}`);
  }

  createPet(pet: Pet): Observable<Pet> {
    return this.post<Pet>(API.PET.CREATE, pet);
  }

  updatePet(pet: Pet): Observable<Pet> {
    return this.put<Pet>(API.PET.UPDATE, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.delete<void>(`${API.PET.DELETE}/${id}`);
  }
}
