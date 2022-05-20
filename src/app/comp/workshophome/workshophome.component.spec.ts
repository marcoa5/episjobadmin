import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshophomeComponent } from './workshophome.component';

describe('WorkshophomeComponent', () => {
  let component: WorkshophomeComponent;
  let fixture: ComponentFixture<WorkshophomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshophomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshophomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
