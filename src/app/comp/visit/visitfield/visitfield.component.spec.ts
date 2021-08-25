import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitfieldComponent } from './visitfield.component';

describe('VisitfieldComponent', () => {
  let component: VisitfieldComponent;
  let fixture: ComponentFixture<VisitfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitfieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
