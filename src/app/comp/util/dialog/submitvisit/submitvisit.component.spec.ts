import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitvisitComponent } from './submitvisit.component';

describe('SubmitvisitComponent', () => {
  let component: SubmitvisitComponent;
  let fixture: ComponentFixture<SubmitvisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitvisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
