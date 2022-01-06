import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComdatedialogComponent } from './comdatedialog.component';

describe('ComdatedialogComponent', () => {
  let component: ComdatedialogComponent;
  let fixture: ComponentFixture<ComdatedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComdatedialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComdatedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
