import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  const mockOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;

    component.label = 'Fruit';
    component.control = new FormControl('');
    component.options = mockOptions;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all options', () => {
    expect(component.filteredOptions().length).toBe(mockOptions.length);
  });

  it('should initialize with isOpen as false', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open dropdown on input focus', () => {
    component.onInputFocus();
    expect(component.isOpen()).toBe(true);
  });

  it('should open dropdown on input', () => {
    component.onInput();
    expect(component.isOpen()).toBe(true);
  });

  it('should filter options based on input value', () => {
    component.control.setValue('an');
    component.onInput();
    expect(component.filteredOptions()).toContain('Banana');
    expect(component.filteredOptions()).not.toContain('Apple');
  });

  it('should show all options when input is cleared', () => {
    component.control.setValue('an');
    component.onInput();
    component.control.setValue('');
    component.onInput();
    expect(component.filteredOptions().length).toBe(mockOptions.length);
  });

  it('should return empty array when no options match', () => {
    component.control.setValue('zzz');
    component.onInput();
    expect(component.filteredOptions().length).toBe(0);
  });

  it('should set control value and close dropdown on selectOption', () => {
    component.isOpen.set(true);
    component.selectOption('Banana');
    expect(component.control.value).toBe('Banana');
    expect(component.isOpen()).toBe(false);
  });

  it('should close dropdown on click outside', () => {
    component.isOpen.set(true);
    const outsideEvent = new MouseEvent('click');
    Object.defineProperty(outsideEvent, 'target', { value: document.body });
    component.onClickOutside(outsideEvent);
    expect(component.isOpen()).toBe(false);
  });
});
