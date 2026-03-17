import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.label()).toBe('');
    expect(component.icon()).toBeUndefined();
    expect(component.danger()).toBe(false);
  });

  it('should emit clicked when button is clicked', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should apply danger class when danger is true', () => {
    const dangerFixture = TestBed.createComponent(MenuItemComponent);
    dangerFixture.componentRef.setInput('danger', true);
    dangerFixture.detectChanges();

    const button = dangerFixture.nativeElement.querySelector('button');
    expect(button.classList).toContain('danger');
  });

  it('should not apply danger class when danger is false', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList).not.toContain('danger');
  });
});
