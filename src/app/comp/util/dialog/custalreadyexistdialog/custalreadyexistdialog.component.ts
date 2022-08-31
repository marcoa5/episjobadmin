import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-custalreadyexistdialog',
  templateUrl: './custalreadyexistdialog.component.html',
  styleUrls: ['./custalreadyexistdialog.component.scss']
})
export class CustalreadyexistdialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CustalreadyexistdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
