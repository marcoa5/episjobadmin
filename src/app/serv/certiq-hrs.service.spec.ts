import { TestBed } from '@angular/core/testing';

import { CertiqHrsService } from './certiq-hrs.service';

describe('CertiqHrsService', () => {
  let service: CertiqHrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertiqHrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
