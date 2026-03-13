import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetDetail } from './pet-detail.component';

describe('PetDetail', () => {
  let component: PetDetail;
  let fixture: ComponentFixture<PetDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
