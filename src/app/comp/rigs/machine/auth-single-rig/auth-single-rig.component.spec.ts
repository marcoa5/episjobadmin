import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSingleRigComponent } from './auth-single-rig.component';

describe('AuthSingleRigComponent', () => {
  let component: AuthSingleRigComponent;
  let fixture: ComponentFixture<AuthSingleRigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthSingleRigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSingleRigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
