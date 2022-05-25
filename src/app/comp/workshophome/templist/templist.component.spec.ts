import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplistComponent } from './templist.component';

describe('TemplistComponent', () => {
  let component: TemplistComponent;
  let fixture: ComponentFixture<TemplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
