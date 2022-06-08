import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivecontractdialogComponent } from './archivecontractdialog.component';

describe('ArchivecontractdialogComponent', () => {
  let component: ArchivecontractdialogComponent;
  let fixture: ComponentFixture<ArchivecontractdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivecontractdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivecontractdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
