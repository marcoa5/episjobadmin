import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveaccountComponent } from './saveaccount.component';

describe('SaveaccountComponent', () => {
  let component: SaveaccountComponent;
  let fixture: ComponentFixture<SaveaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
