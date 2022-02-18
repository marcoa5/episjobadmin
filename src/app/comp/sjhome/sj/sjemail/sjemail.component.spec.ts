import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjemailComponent } from './sjemail.component';

describe('SjemailComponent', () => {
  let component: SjemailComponent;
  let fixture: ComponentFixture<SjemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
