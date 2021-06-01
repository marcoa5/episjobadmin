import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtechComponent } from './newtech.component';

describe('NewtechComponent', () => {
  let component: NewtechComponent;
  let fixture: ComponentFixture<NewtechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewtechComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
