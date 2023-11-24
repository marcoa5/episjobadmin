import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesslistComponent } from './accesslist.component';

describe('AccesslistComponent', () => {
  let component: AccesslistComponent;
  let fixture: ComponentFixture<AccesslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
