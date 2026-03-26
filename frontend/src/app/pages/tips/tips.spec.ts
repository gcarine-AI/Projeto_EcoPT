import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsComponent } from './tips';

describe('Tips', () => {
  let component: TipsComponent;
  let fixture: ComponentFixture<TipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
