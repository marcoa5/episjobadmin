import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'episjob-sjnumberdialog',
  templateUrl: './sjnumberdialog.component.html',
  styleUrls: ['./sjnumberdialog.component.scss']
})
export class SjnumberdialogComponent implements OnInit {
  sj=new FormControl(this.data?this.data.sj:'')
  constructor(private dialogRef:MatDialogRef<SjnumberdialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }
  

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    //if(this.data.sj) this.sj.setValue(this.data.sj)
  }

  onNoClick(){
     this.dialogRef.close() 
  }

  save(){
    this.dialogRef.close(this.sj.value)
  }

}
