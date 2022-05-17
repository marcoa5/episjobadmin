import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopfilesComponent } from './workshopfiles.component';

describe('WorkshopfilesComponent', () => {
  let component: WorkshopfilesComponent;
  let fixture: ComponentFixture<WorkshopfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
