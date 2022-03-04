import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppupdComponent } from './appupd.component';

describe('AppupdComponent', () => {
  let component: AppupdComponent;
  let fixture: ComponentFixture<AppupdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppupdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppupdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
