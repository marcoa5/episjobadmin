import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrssplitComponent } from './hrssplit.component';

describe('HrssplitComponent', () => {
  let component: HrssplitComponent;
  let fixture: ComponentFixture<HrssplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrssplitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrssplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
