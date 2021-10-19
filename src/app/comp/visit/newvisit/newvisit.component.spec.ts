import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewvisitComponent } from './newvisit.component';

describe('NewvisitComponent', () => {
  let component: NewvisitComponent;
  let fixture: ComponentFixture<NewvisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewvisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
