import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-newdata',
  templateUrl: './newdata.component.html',
  styleUrls: ['./newdata.component.scss']
})
export class NewdataComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<NewdataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
