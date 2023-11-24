import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'episjob-confirmreplacement',
  templateUrl: './confirmreplacement.component.html',
  styleUrls: ['./confirmreplacement.component.scss']
})
export class ConfirmreplacementComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmreplacementComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
