import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SjdialogComponent } from '../../sjlist/sjdialog/sjdialog.component';

@Component({
  selector: 'episjob-partsdialog',
  templateUrl: './partsdialog.component.html',
  styleUrls: ['./partsdialog.component.scss']
})
export class PartsdialogComponent implements OnInit {
  displayedColumns: string[]=['pnshort','p/n', 'Description', 'LLP', 'Qty', 'Tot']
  constructor(public dialogRef: MatDialogRef<PartsdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }
  
  onNoClick(){
    this.dialogRef.close()
  }
}
