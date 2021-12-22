import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'episjob-deldialog',
  templateUrl: './deldialog.component.html',
  styleUrls: ['./deldialog.component.scss']
})
export class DeldialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeldialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
