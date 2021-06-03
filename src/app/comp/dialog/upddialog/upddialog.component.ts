import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'episjob-upddialog',
  templateUrl: './upddialog.component.html',
  styleUrls: ['./upddialog.component.scss']
})
export class UpddialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  contr(){
    if(this.data.name!='') return `${this.data.name} will be updated. Proceed?`
    if(this.data.sn!='') return `${this.data.sn} will be updated. Proceed?`
    return `New customer will be added. Proceed?`
  }
}
