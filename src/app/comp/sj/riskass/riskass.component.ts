import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-riskass',
  templateUrl: './riskass.component.html',
  styleUrls: ['./riskass.component.scss']
})
export class RiskassComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RiskassComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
