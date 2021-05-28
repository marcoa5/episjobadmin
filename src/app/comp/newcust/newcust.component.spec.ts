import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcustComponent } from './newcust.component';

describe('NewcustComponent', () => {
  let component: NewcustComponent;
  let fixture: ComponentFixture<NewcustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewcustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
