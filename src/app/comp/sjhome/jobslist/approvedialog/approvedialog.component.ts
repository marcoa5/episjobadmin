import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-approvedialog',
  templateUrl: './approvedialog.component.html',
  styleUrls: ['./approvedialog.component.scss']
})
export class ApprovedialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<ApprovedialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  close(a:any){
    this.dialogRef.close(a)
  }

}
