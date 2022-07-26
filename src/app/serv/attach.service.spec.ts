import { TestBed } from '@angular/core/testing';

import { AttachService } from './attach.service';

describe('AttachService', () => {
  let service: AttachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
