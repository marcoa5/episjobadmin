import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-importparts',
  templateUrl: './importparts.component.html',
  styleUrls: ['./importparts.component.scss']
})
export class ImportpartsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImportpartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
