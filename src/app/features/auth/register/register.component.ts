import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TextfieldComponent } from '../../../shared/components/textfield/textfield.component';
import { User } from '../../../shared/models/user.model';

const CARD_STYLE: Record<string, string> = {
  display: 'flex',
  'flex-direction': 'column',
  gap: '16px',
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, CardComponent, TextfieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cardStyle = CARD_STYLE;

  username = '';
  password = '';
  confirmPassword = '';

  get passwordMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.password !== this.confirmPassword;
  }

  get isFormInvalid(): boolean {
    return (
      !this.username.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim() ||
      this.passwordMismatch
    );
  }

  submit() {
    if (this.isFormInvalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .register({ username: this.username, password: this.password } as User)
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Registration failed. Please try again.');
          this.loading.set(false);
        },
      });
  }
}
