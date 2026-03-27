import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextfieldComponent } from './textfield.component';

describe('TextfieldComponent', () => {
  let component: TextfieldComponent;
  let fixture: ComponentFixture<TextfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextfieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextfieldComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Username');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as text', () => {
    expect(component.type()).toBe('text');
  });

  it('should have default placeholder as empty string', () => {
    expect(component.placeholder()).toBe('Type here...');
  });

  it('should render the given placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter your username');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Enter your username');
  });

  it('should render type password when set', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');
  });

  it('should bind control value to input', () => {
    fixture.componentRef.setInput('type', 'text');
    component.writeValue('hello');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('hello');
  });
});
