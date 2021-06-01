import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCancelbuttonsComponent } from './add-cancelbuttons.component';

describe('AddCancelbuttonsComponent', () => {
  let component: AddCancelbuttonsComponent;
  let fixture: ComponentFixture<AddCancelbuttonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCancelbuttonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCancelbuttonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
