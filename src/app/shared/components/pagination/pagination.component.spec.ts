import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return correct pageIndex from currentPage', () => {
    fixture.componentRef.setInput('currentPage', 3);
    expect(component.pageIndex()).toBe(2);
  });

  it('should emit pageChange with 1-based page on onPage', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    const event = { pageIndex: 2, pageSize: 10, length: 50 } as PageEvent;
    component.onPage(event);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should emit page 1 when pageIndex is 0', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    const event = { pageIndex: 0, pageSize: 10, length: 50 } as PageEvent;
    component.onPage(event);
    expect(spy).toHaveBeenCalledWith(1);
  });
});
