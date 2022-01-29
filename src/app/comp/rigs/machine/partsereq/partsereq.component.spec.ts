import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsereqComponent } from './partsereq.component';

describe('PartsereqComponent', () => {
  let component: PartsereqComponent;
  let fixture: ComponentFixture<PartsereqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartsereqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsereqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
