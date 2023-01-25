import { TestBed } from '@angular/core/testing';

import { CheckConsuntivoQtyService } from './check-consuntivo-qty.service';

describe('CheckConsuntivoQtyService', () => {
  let service: CheckConsuntivoQtyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckConsuntivoQtyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
