import { TestBed } from '@angular/core/testing';

import { CarsharingService } from './carsharing';

describe('Carsharing', () => {
  let service: CarsharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarsharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
