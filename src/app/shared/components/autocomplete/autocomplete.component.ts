import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) options!: string[];
  @Input() placeholder = '';

  private readonly eRef = inject(ElementRef);

  readonly inputId = `autocomplete-${Math.random().toString(36).substring(2, 9)}`;
  readonly filteredOptions = signal<string[]>([]);
  readonly isOpen = signal(false);

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngOnInit(): void {
    this.filteredOptions.set([...this.options]);
  }

  writeValue(value: string): void {
    this.value = value ?? '';
    this.filterOptions();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  selectOption(option: string): void {
    this.value = option;
    this.onChange(this.value);
    this.isOpen.set(false);
  }

  private filterOptions(): void {
    const query = (this.value ?? '').toLowerCase();
    this.filteredOptions.set(this.options.filter((opt) => opt.toLowerCase().includes(query)));
  }
}
