import { TestBed } from '@angular/core/testing';

import { ExportPotentialService } from './export-potential.service';

describe('ExportPotentialService', () => {
  let service: ExportPotentialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportPotentialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
