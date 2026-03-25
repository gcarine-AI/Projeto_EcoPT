import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsharingComponent } from './carsharing';

describe('Carsharing', () => {
  let component: CarsharingComponent;
  let fixture: ComponentFixture<CarsharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsharingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarsharingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
