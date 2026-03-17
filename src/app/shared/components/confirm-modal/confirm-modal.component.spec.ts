import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.cdk-overlay-container');
    overlays.forEach((o) => (o.innerHTML = ''));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not render dialog in DOM if isOpen is false', async () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    await fixture.whenStable();

    const dialogContent = document.querySelector('.modal-content');
    expect(dialogContent).toBeNull();
  });

  it('should render dialog content when isOpen is true', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Konfirmasi Hapus');
    fixture.detectChanges();
    await fixture.whenStable();

    const title = document.querySelector('.modal-title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('Konfirmasi Hapus');
  });

  it('should emit cancelled event when backdrop is clicked', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.fn();
    component.cancelled.subscribe(spy);

    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    backdrop?.dispatchEvent(new Event('click'));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled event when Escape key is pressed', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.fn();
    component.cancelled.subscribe(spy);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit confirmed event when primary button is clicked', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.fn();
    component.confirmed.subscribe(spy);

    const buttons = document.querySelectorAll('app-button');
    const confirmBtn = buttons[0];
    confirmBtn.dispatchEvent(new Event('click'));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelled event when secondary button is clicked', async () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.fn();
    component.cancelled.subscribe(spy);

    const buttons = document.querySelectorAll('app-button');
    const cancelBtn = buttons[1];
    cancelBtn.dispatchEvent(new Event('click'));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
  });
});
