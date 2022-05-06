import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-savedialog',
  templateUrl: './savedialog.component.html',
  styleUrls: ['./savedialog.component.scss']
})
export class SavedialogComponent implements OnInit {

  constructor(private dialogref:MatDialogRef<SavedialogComponent>, @Inject(MAT_DIALOG_DATA) private data:any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogref.close()
  }

}
