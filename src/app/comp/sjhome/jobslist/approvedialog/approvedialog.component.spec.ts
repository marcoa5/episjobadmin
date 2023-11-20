import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedialogComponent } from './approvedialog.component';

describe('ApprovedialogComponent', () => {
  let component: ApprovedialogComponent;
  let fixture: ComponentFixture<ApprovedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
