import { TestBed } from '@angular/core/testing';

import { MarketplaceService } from './marketplace.ts';

describe('MarketplaceTs', () => {
  let service: MarketplaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketplaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
