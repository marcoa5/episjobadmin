import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'episjob-selectmonth',
  templateUrl: './selectmonth.component.html',
  styleUrls: ['./selectmonth.component.scss']
})
export class SelectmonthComponent implements OnInit {
  selectMonthForm!:FormGroup
  date = new FormControl(moment());
  constructor(private dialogRef:MatDialogRef<SelectmonthComponent>, @Inject(MAT_DIALOG_DATA) private data:any, private fb:FormBuilder) {

  }

  ngOnInit(): void {
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  setMonthAndYear(normalizedMonthAndYear: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

}
