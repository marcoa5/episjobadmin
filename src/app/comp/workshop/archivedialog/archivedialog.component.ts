import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@Component({
  selector: 'episjob-archivedialog',
  templateUrl: './archivedialog.component.html',
  styleUrls: ['./archivedialog.component.scss']
})
export class ArchivedialogComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ArchivedialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) {

  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
