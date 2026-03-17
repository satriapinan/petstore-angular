import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarState {
  message: string;
  type: SnackbarType;
  visible: boolean;
  hiding: boolean;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly state = signal<SnackbarState>({
    message: '',
    type: 'info',
    visible: false,
    hiding: false,
  });

  private timer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: SnackbarType = 'info', duration = 3000): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.state.set({ message, type, visible: true, hiding: false });

    this.timer = setTimeout(() => this.dismiss(), duration);
  }

  dismiss(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.state.update((s) => ({ ...s, hiding: true }));

    this.hideTimer = setTimeout(() => {
      this.state.update((s) => ({ ...s, visible: false, hiding: false }));
      this.hideTimer = null;
    }, 250);
  }
}
