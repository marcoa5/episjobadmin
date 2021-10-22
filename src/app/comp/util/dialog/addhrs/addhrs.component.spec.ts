import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhrsComponent } from './addhrs.component';

describe('AddhrsComponent', () => {
  let component: AddhrsComponent;
  let fixture: ComponentFixture<AddhrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddhrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddhrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
