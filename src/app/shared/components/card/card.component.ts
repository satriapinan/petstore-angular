import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly minWidth = input('100%');
  readonly padding = input('36px');
  readonly borderRadius = input('var(--border-radius)');
  readonly background = input<string | undefined>();
  readonly customStyle = input<Record<string, string>>({});
}
