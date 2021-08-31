import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavevisitComponent } from './savevisit.component';

describe('SavevisitComponent', () => {
  let component: SavevisitComponent;
  let fixture: ComponentFixture<SavevisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavevisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavevisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
