import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectsjComponent } from './selectsj.component';

describe('SelectsjComponent', () => {
  let component: SelectsjComponent;
  let fixture: ComponentFixture<SelectsjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectsjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectsjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
