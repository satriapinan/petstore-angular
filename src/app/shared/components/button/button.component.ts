import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [SpinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly label = input('');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly variant = input<'contained' | 'outline'>('contained');
  readonly color = input<'primary' | 'danger' | 'warning' | 'success'>('primary');
  readonly icon = input<string | undefined>();
  readonly fullWidth = input(false);
  readonly fontSize = input<string | undefined>();
  readonly fontWeight = input<string | undefined>();
  readonly padding = input('12px 16px');
}
