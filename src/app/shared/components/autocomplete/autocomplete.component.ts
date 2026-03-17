import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) options!: string[];
  @Input() placeholder = '';

  private readonly eRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly inputId = `autocomplete-${Math.random().toString(36).substring(2, 9)}`;
  readonly filteredOptions = signal<string[]>([]);
  readonly isOpen = signal(false);

  ngOnInit(): void {
    this.filteredOptions.set([...this.options]);
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.filterOptions();
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  onInputFocus(): void {
    this.isOpen.set(true);
    this.filterOptions();
  }

  onInput(): void {
    this.isOpen.set(true);
    this.filterOptions();
  }

  selectOption(option: string): void {
    this.control.setValue(option);
    this.isOpen.set(false);
  }

  private filterOptions(): void {
    const query = (this.control.value ?? '').toLowerCase();
    this.filteredOptions.set(this.options.filter((opt) => opt.toLowerCase().includes(query)));
  }
}
