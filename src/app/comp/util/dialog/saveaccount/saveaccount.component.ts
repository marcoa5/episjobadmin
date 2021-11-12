import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'episjob-saveaccount',
  templateUrl: './saveaccount.component.html',
  styleUrls: ['./saveaccount.component.scss']
})
export class SaveaccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SaveaccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
