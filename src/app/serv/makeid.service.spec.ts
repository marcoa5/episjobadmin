import { TestBed } from '@angular/core/testing';

import { MakeidService } from './makeid.service';

describe('MakeidService', () => {
  let service: MakeidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
