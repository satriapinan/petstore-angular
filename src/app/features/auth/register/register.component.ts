import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, CardComponent, TextfieldComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly cardStyle = CARD_STYLE;

  readonly form = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') && this.form.controls.confirmPassword.dirty;
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { username, password } = this.form.getRawValue();

    this.authService.register({ username, password } as User).subscribe({
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
