import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open when toggle is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('should close when toggle is called again', () => {
    component.toggle();
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should close when close is called', () => {
    component.toggle();
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should close when Escape key is pressed', () => {
    component.toggle();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isOpen()).toBe(false);
  });

  it('should close when clicking outside the component', () => {
    component.toggle();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.isOpen()).toBe(false);
  });

  it('should not close when clicking inside the component', () => {
    component.toggle();
    fixture.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.isOpen()).toBe(true);
  });
});
