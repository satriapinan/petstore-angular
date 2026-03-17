import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, MatDialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent implements OnDestroy {
  readonly isOpen = input(false);
  readonly title = input('Are you sure?');
  readonly message = input(
    'This action cannot be undone. All values associated with this field will be lost.',
  );
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly loading = input(false);

  readonly icon = input('mdi:alert-outline');
  readonly type = input<'primary' | 'danger' | 'warning' | 'success'>('danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly dialogTemplate = viewChild.required<TemplateRef<unknown>>('dialogTemplate');

  private readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<unknown> | null = null;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const template = this.dialogTemplate();

      if (open && template) {
        if (!this.dialogRef) {
          this.dialogRef = this.dialog.open(template, {
            panelClass: 'custom-confirm-panel',
            disableClose: true,
            autoFocus: false,
          });

          this.dialogRef.backdropClick().subscribe(() => this.cancelled.emit());
          this.dialogRef.keydownEvents().subscribe((event) => {
            if (event.key === 'Escape') this.cancelled.emit();
          });
        }
      } else if (this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }
}
