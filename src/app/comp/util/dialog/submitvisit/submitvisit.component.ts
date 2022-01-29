import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-submitvisit',
  templateUrl: './submitvisit.component.html',
  styleUrls: ['./submitvisit.component.scss']
})
export class SubmitvisitComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SubmitvisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
