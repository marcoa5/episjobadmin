import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjhomeComponent } from './sjhome.component';

describe('SjhomeComponent', () => {
  let component: SjhomeComponent;
  let fixture: ComponentFixture<SjhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjhomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
