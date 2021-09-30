import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImifabiComponent } from './imifabi.component';

describe('ImifabiComponent', () => {
  let component: ImifabiComponent;
  let fixture: ComponentFixture<ImifabiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImifabiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImifabiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
