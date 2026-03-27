import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQComponent } from './faq';

describe('Faq', () => {
  let component: FAQComponent;
  let fixture: ComponentFixture<FAQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FAQComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FAQComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
