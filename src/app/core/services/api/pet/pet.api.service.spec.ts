import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from '../../../../shared/constants/api.constants';
import { PetApiService } from './pet.api.service';

describe('PetApiService', () => {
  let service: PetApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(PetApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get pets', () => {
    service.getPets('available').subscribe();

    const req = httpMock.expectOne((req) => req.url === API.PET.FIND_BY_STATUS);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get pet by id', () => {
    service.getPetById(1).subscribe();

    const req = httpMock.expectOne(`${API.PET.GET}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should create pet', () => {
    service.createPet({ name: 'dog', photoUrls: [] }).subscribe();

    const req = httpMock.expectOne(API.PET.CREATE);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update pet', () => {
    service.updatePet({ name: 'dog', photoUrls: [] }).subscribe();

    const req = httpMock.expectOne(API.PET.UPDATE);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete pet', () => {
    service.deletePet(1).subscribe();

    const req = httpMock.expectOne(`${API.PET.DELETE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
