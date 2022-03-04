import { TestBed } from '@angular/core/testing';

import { SwupdateService } from './swupdate.service';

describe('SwupdateService', () => {
  let service: SwupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
