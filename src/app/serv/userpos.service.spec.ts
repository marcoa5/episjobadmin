import { TestBed } from '@angular/core/testing';

import { UserposService } from './userpos.service';

describe('UserposService', () => {
  let service: UserposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
