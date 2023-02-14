import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancefromsjComponent } from './balancefromsj.component';

describe('BalancefromsjComponent', () => {
  let component: BalancefromsjComponent;
  let fixture: ComponentFixture<BalancefromsjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalancefromsjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancefromsjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
