import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractshomeComponent } from './contractshome.component';

describe('ContractshomeComponent', () => {
  let component: ContractshomeComponent;
  let fixture: ComponentFixture<ContractshomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractshomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
