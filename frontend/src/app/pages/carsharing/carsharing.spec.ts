import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarsharingComponent } from './carsharing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

describe('Carsharing', () => {
  let component: CarsharingComponent;
  let fixture: ComponentFixture<CarsharingComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [CarsharingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CarsharingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
