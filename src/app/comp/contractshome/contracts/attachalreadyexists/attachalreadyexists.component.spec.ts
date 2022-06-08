import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachalreadyexistsComponent } from './attachalreadyexists.component';

describe('AttachalreadyexistsComponent', () => {
  let component: AttachalreadyexistsComponent;
  let fixture: ComponentFixture<AttachalreadyexistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachalreadyexistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachalreadyexistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
