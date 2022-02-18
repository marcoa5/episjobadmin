import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpvComponent } from './spv.component';

describe('SpvComponent', () => {
  let component: SpvComponent;
  let fixture: ComponentFixture<SpvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
