import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-attachalreadyexists',
  templateUrl: './attachalreadyexists.component.html',
  styleUrls: ['./attachalreadyexists.component.scss']
})
export class AttachalreadyexistsComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<AttachalreadyexistsComponent,any>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
