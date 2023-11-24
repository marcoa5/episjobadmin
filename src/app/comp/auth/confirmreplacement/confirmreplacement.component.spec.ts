import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmreplacementComponent } from './confirmreplacement.component';

describe('ConfirmreplacementComponent', () => {
  let component: ConfirmreplacementComponent;
  let fixture: ComponentFixture<ConfirmreplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmreplacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmreplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
