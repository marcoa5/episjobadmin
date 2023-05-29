import { TestBed } from '@angular/core/testing';

import { ExportContactsService } from './export-contacts.service';

describe('ExportContactsService', () => {
  let service: ExportContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
