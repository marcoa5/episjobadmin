import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-archivecontractdialog',
  templateUrl: './archivecontractdialog.component.html',
  styleUrls: ['./archivecontractdialog.component.scss']
})
export class ArchivecontractdialogComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ArchivecontractdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
