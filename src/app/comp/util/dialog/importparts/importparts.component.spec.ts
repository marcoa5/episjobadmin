import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportpartsComponent } from './importparts.component';

describe('ImportpartsComponent', () => {
  let component: ImportpartsComponent;
  let fixture: ComponentFixture<ImportpartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportpartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportpartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
