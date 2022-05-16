import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedialogComponent } from './archivedialog.component';

describe('ArchivedialogComponent', () => {
  let component: ArchivedialogComponent;
  let fixture: ComponentFixture<ArchivedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
