import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofrequestsComponent } from './listofrequests.component';

describe('ListofrequestsComponent', () => {
  let component: ListofrequestsComponent;
  let fixture: ComponentFixture<ListofrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListofrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListofrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
