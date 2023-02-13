import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcontactcustomerselectionComponent } from './newcontactcustomerselection.component';

describe('NewcontactcustomerselectionComponent', () => {
  let component: NewcontactcustomerselectionComponent;
  let fixture: ComponentFixture<NewcontactcustomerselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewcontactcustomerselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcontactcustomerselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
