import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjComponent } from './sj.component';

describe('SjComponent', () => {
  let component: SjComponent;
  let fixture: ComponentFixture<SjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
