import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceComponent } from './marketplace';

describe('Marketplace', () => {
  let component: MarketplaceComponent;
  let fixture: ComponentFixture<MarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketplaceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
