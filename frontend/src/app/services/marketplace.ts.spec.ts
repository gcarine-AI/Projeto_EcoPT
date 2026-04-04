import { TestBed } from '@angular/core/testing';

import { MarketplaceTs } from './marketplace.ts';

describe('MarketplaceTs', () => {
  let service: MarketplaceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketplaceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
