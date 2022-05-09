import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RigcontractComponent } from './rigcontract.component';

describe('RigcontractComponent', () => {
  let component: RigcontractComponent;
  let fixture: ComponentFixture<RigcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RigcontractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RigcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
