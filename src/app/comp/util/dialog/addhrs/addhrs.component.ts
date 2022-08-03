import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CheckwidthService } from 'src/app/serv/checkwidth.service';


@Component({
  selector: 'episjob-addhrs',
  templateUrl: './addhrs.component.html',
  styleUrls: ['./addhrs.component.scss']
})
export class AddhrsComponent implements OnInit {
  hrsData:FormGroup
  
  constructor(private ch:CheckwidthService, public dialogRef: MatDialogRef<AddhrsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public fb: FormBuilder) { 
    this.hrsData= fb.group({
      date: [new Date(),Validators.required],
      orem: [''],
      perc1: [''],
      perc2: [''],
      perc3: [''],
    })
  }

  ngOnInit(): void {
  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  chW(){
    return this.ch.isTouch()
  }
}
