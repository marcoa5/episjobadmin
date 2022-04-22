import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentdialogComponent } from './attachmentdialog.component';

describe('AttachmentdialogComponent', () => {
  let component: AttachmentdialogComponent;
  let fixture: ComponentFixture<AttachmentdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
