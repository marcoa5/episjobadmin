import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskassComponent } from './riskass.component';

describe('RiskassComponent', () => {
  let component: RiskassComponent;
  let fixture: ComponentFixture<RiskassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
