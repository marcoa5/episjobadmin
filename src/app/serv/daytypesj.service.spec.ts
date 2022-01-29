import { TestBed } from '@angular/core/testing';

import { DaytypesjService } from './daytypesj.service';

describe('DaytypesjService', () => {
  let service: DaytypesjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaytypesjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
