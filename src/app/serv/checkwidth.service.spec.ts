import { TestBed } from '@angular/core/testing';

import { CheckwidthService } from './checkwidth.service';

describe('CheckwidthService', () => {
  let service: CheckwidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckwidthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
