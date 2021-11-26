import { TestBed } from '@angular/core/testing';

import { DaytypeService } from './daytype.service';

describe('DaytypeService', () => {
  let service: DaytypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaytypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
