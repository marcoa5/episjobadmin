import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'episjob-selectyear',
  templateUrl: './selectyear.component.html',
  styleUrls: ['./selectyear.component.scss']
})
export class SelectyearComponent implements OnInit {
  year!:FormGroup
  constructor(public dialogRef: MatDialogRef<SelectyearComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.year=fb.group({
      ye:[this.data.years[0]]
    })
  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
