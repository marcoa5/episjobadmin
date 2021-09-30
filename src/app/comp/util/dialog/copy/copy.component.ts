import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'episjob-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CopyComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
