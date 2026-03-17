import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextfieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly type = input<'text' | 'password'>('text');
  readonly placeholder = input('Type here...');

  readonly inputId = `textfield-${nextId++}`;
}
