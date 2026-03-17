import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply default styles', () => {
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;

    expect(card.style.minWidth).toBe('100%');
    expect(card.style.padding).toBe('36px');
    expect(card.style.borderRadius).toBe('var(--border-radius)');
  });

  it('should apply custom minWidth', () => {
    fixture.componentRef.setInput('minWidth', '320px');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.style.minWidth).toBe('320px');
  });

  it('should apply custom padding', () => {
    fixture.componentRef.setInput('padding', '24px');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.style.padding).toBe('24px');
  });

  it('should apply custom borderRadius', () => {
    fixture.componentRef.setInput('borderRadius', '8px');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.style.borderRadius).toBe('8px');
  });

  it('should apply custom background', () => {
    fixture.componentRef.setInput('background', '#f9fafb');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.getAttribute('style')).toContain('background: rgb(249, 250, 251)');
  });

  it('should render projected content', () => {
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');
    expect(card).toBeTruthy();
  });
});
