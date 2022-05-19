import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'episjob-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CopyComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private clip: Clipboard) { }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
