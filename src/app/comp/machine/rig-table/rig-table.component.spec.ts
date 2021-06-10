import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RigTableComponent } from './rig-table.component';

describe('RigTableComponent', () => {
  let component: RigTableComponent;
  let fixture: ComponentFixture<RigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RigTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
