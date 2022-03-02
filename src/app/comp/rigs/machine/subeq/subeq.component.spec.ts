import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubeqComponent } from './subeq.component';

describe('SubeqComponent', () => {
  let component: SubeqComponent;
  let fixture: ComponentFixture<SubeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubeqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
