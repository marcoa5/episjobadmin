import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsubeqComponent } from './newsubeq.component';

describe('NewsubeqComponent', () => {
  let component: NewsubeqComponent;
  let fixture: ComponentFixture<NewsubeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsubeqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsubeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
