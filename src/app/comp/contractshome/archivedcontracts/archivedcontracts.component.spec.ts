import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedcontractsComponent } from './archivedcontracts.component';

describe('ArchivedcontractsComponent', () => {
  let component: ArchivedcontractsComponent;
  let fixture: ComponentFixture<ArchivedcontractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedcontractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedcontractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
