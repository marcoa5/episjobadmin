import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpartsrequestComponent } from './newpartsrequest.component';

describe('NewpartsrequestComponent', () => {
  let component: NewpartsrequestComponent;
  let fixture: ComponentFixture<NewpartsrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewpartsrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpartsrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
