import { TestBed } from '@angular/core/testing';

import { SendSJService } from './send-sj.service';

describe('SendSJService', () => {
  let service: SendSJService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendSJService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
