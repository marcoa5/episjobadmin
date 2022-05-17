import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-submitweekdialog',
  templateUrl: './submitweekdialog.component.html',
  styleUrls: ['./submitweekdialog.component.scss']
})
export class SubmitweekdialogComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<SubmitweekdialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any ) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
