import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-selectmonth',
  templateUrl: './selectmonth.component.html',
  styleUrls: ['./selectmonth.component.scss']
})
export class SelectmonthComponent implements OnInit {
  date= new FormControl(new Date())
  constructor(private dialogRef:MatDialogRef<SelectmonthComponent>, @Inject(MAT_DIALOG_DATA) private data:any, private fb:FormBuilder) {
    
  }

  ngOnInit() {
  }

  setMonthAndYear(e:any, dp:any) {
    this.date.setValue(e)
    dp.close()

    this.dialogRef.close(e)
  }


  onNoClick(){
    this.dialogRef.close()
  }

}
