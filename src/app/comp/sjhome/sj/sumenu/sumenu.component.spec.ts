import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumenuComponent } from './sumenu.component';

describe('SumenuComponent', () => {
  let component: SumenuComponent;
  let fixture: ComponentFixture<SumenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SumenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
