import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitdetailsComponent } from './visitdetails.component';

describe('VisitdetailsComponent', () => {
  let component: VisitdetailsComponent;
  let fixture: ComponentFixture<VisitdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
