import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitlistComponent } from './visitlist.component';

describe('VisitlistComponent', () => {
  let component: VisitlistComponent;
  let fixture: ComponentFixture<VisitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
