import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbutComponent } from './addbut.component';

describe('AddbutComponent', () => {
  let component: AddbutComponent;
  let fixture: ComponentFixture<AddbutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
