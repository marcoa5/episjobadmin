import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdipotentialComponent } from './edipotential.component';

describe('EdipotentialComponent', () => {
  let component: EdipotentialComponent;
  let fixture: ComponentFixture<EdipotentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdipotentialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdipotentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
