import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SjlistComponent } from './sjlist.component';

describe('SjlistComponent', () => {
  let component: SjlistComponent;
  let fixture: ComponentFixture<SjlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SjlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SjlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
