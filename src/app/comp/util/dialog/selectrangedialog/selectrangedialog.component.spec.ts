import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectrangedialogComponent } from './selectrangedialog.component';

describe('SelectrangedialogComponent', () => {
  let component: SelectrangedialogComponent;
  let fixture: ComponentFixture<SelectrangedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectrangedialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectrangedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
