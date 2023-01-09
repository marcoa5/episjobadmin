import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpricelistComponent } from './newpricelist.component';

describe('NewpricelistComponent', () => {
  let component: NewpricelistComponent;
  let fixture: ComponentFixture<NewpricelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpricelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
