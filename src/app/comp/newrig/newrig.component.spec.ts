import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrigComponent } from './newrig.component';

describe('NewrigComponent', () => {
  let component: NewrigComponent;
  let fixture: ComponentFixture<NewrigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewrigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewrigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
