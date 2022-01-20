import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-newaddress',
  templateUrl: './newaddress.component.html',
  styleUrls: ['./newaddress.component.scss']
})
export class NewaddressComponent implements OnInit {
  add:any=''
  constructor(public dialogRef: MatDialogRef<NewaddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
