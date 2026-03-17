import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show label', () => {
    fixture.componentRef.setInput('label', 'Simpan');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Simpan');
  });

  it('should apply correct variant and color classes', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain('btn--outline');
    expect(button.classList).toContain('btn--color-danger');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should render spinner and disable button when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    const spinner = fixture.nativeElement.querySelector('app-spinner');

    expect(button.disabled).toBe(true);
    expect(spinner).toBeTruthy();
  });

  it('should render icon when icon input is provided', () => {
    fixture.componentRef.setInput('icon', 'mdi:check');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('iconify-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('icon')).toBe('mdi:check');
  });
});
