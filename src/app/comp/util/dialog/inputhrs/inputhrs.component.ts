import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'episjob-inputhrs',
  templateUrl: './inputhrs.component.html',
  styleUrls: ['./inputhrs.component.scss']
})
export class InputhrsComponent implements OnInit {
  ore:any=''
  constructor(public dialogRef: MatDialogRef<InputhrsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.ore=this.data.hr
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
