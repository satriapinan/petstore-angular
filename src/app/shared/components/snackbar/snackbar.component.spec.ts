import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { SnackbarComponent } from './snackbar.component';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  let snackbarService: SnackbarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    snackbarService = TestBed.inject(SnackbarService);
    vi.useFakeTimers();
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render snackbar when not visible', () => {
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el).toBeNull();
  });

  it('should render snackbar when visible', () => {
    snackbarService.show('Test message', 'success');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el).not.toBeNull();
  });

  it('should display correct message', () => {
    snackbarService.show('Pet berhasil ditambahkan!', 'success');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar span');
    expect(el.textContent).toContain('Pet berhasil ditambahkan!');
  });

  it('should apply correct type class', () => {
    snackbarService.show('Error!', 'error');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el.classList).toContain('error');
  });

  it('should apply success class', () => {
    snackbarService.show('Success!', 'success');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el.classList).toContain('success');
  });

  it('should apply info class', () => {
    snackbarService.show('Info!', 'info');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el.classList).toContain('info');
  });

  it('should not have hiding class when snackbar is first shown', () => {
    snackbarService.show('Hello!', 'success');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el.classList).not.toContain('hiding');
  });

  it('should add hiding class when close button is clicked', () => {
    snackbarService.show('Dismiss me', 'info');
    fixture.detectChanges();
    const closeBtn = fixture.nativeElement.querySelector('.close');
    closeBtn.click();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('hiding');
  });

  it('should remove snackbar from DOM after hide animation completes', () => {
    snackbarService.show('Dismiss me', 'info');
    fixture.detectChanges();
    const closeBtn = fixture.nativeElement.querySelector('.close');
    closeBtn.click();
    fixture.detectChanges();
    vi.advanceTimersByTime(250);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.snackbar');
    expect(el).toBeNull();
  });
});
