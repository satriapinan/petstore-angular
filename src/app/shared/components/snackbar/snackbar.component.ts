import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  readonly snackbar = inject(SnackbarService);
}
