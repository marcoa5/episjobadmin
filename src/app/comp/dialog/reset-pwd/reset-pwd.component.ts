import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA  } from '@angular/material/dialog'

@Component({
  selector: 'episjob-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ResetPwdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
