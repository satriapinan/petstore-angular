import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state as not visible', () => {
    expect(service.state().visible).toBe(false);
  });

  it('should show snackbar with correct message and type', () => {
    service.show('Hello', 'success');
    expect(service.state()).toMatchObject({
      message: 'Hello',
      type: 'success',
      visible: true,
      hiding: false,
    });
  });

  it('should default type to info when not provided', () => {
    service.show('Info message');
    expect(service.state().type).toBe('info');
  });

  it('should start hiding after duration then become invisible', () => {
    service.show('Auto dismiss', 'info', 3000);
    expect(service.state().visible).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(service.state().hiding).toBe(true);
    expect(service.state().visible).toBe(true);
    vi.advanceTimersByTime(250);
    expect(service.state().visible).toBe(false);
    expect(service.state().hiding).toBe(false);
  });

  it('should dismiss snackbar manually', () => {
    service.show('Manual dismiss', 'error');
    service.dismiss();
    expect(service.state().hiding).toBe(true);
    vi.advanceTimersByTime(250);
    expect(service.state().visible).toBe(false);
  });

  it('should reset timer when show is called again before duration ends', () => {
    service.show('First', 'info', 3000);
    vi.advanceTimersByTime(2000);
    service.show('Second', 'success', 3000);
    vi.advanceTimersByTime(2000);
    expect(service.state().visible).toBe(true);
    expect(service.state().message).toBe('Second');
    vi.advanceTimersByTime(1000);
    expect(service.state().hiding).toBe(true);
    vi.advanceTimersByTime(250);
    expect(service.state().visible).toBe(false);
  });
});
