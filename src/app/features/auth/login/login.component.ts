import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TextfieldComponent } from '../../../shared/components/textfield/textfield.component';

const CARD_STYLE: Record<string, string> = {
  display: 'flex',
  'flex-direction': 'column',
  gap: '16px',
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, CardComponent, TextfieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cardStyle = CARD_STYLE;

  username = '';
  password = '';

  get isFormInvalid(): boolean {
    return !this.username.trim() || !this.password.trim();
  }

  submit() {
    if (this.isFormInvalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Invalid username or password');
        this.loading.set(false);
      },
    });
  }
}
