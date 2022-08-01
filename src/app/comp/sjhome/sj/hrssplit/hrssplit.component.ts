import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ComdatedialogComponent } from 'src/app/comp/util/dialog/comdatedialog/comdatedialog.component';
import { environment } from 'src/environments/environment';

export interface list{
  fam: string
  hrs: number
}

@Component({
  selector: 'episjob-hrssplit',
  templateUrl: './hrssplit.component.html',
  styleUrls: ['./hrssplit.component.scss']
})
export class HrssplitComponent implements OnInit {
  hrs!: FormGroup
  fam = environment.imiFabiFam
  
  hrssum:number=0
  list:list[]=[]
  constructor(private fb:FormBuilder, public dialogRef: MatDialogRef<ComdatedialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.hrs = fb.group({
      family: ['', Validators.required],
      hr: [0, Validators.required]
    })
  }
  ngOnInit(): void {
    if(this.data.imi!=''){
      let z=this.data.imi
      let a=z.substring(0,z.length-1)
      a.split('@').forEach((b:any)=>{
        this.list.push({fam: b.split(';')[0], hrs: b.split(';')[1]})
        this.hrssum+=b.split(';')[1]*1
      })
      this.enable()
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(){
    this.list.push({fam: this.hrs.controls.family.value, hrs: this.hrs.controls.hr.value})
    this.hrssum+=this.hrs.controls.hr.value
    this.hrs.reset()
    this.hrs.setErrors(null)
    this.enable()
  }

  del(n:number){
    this.hrssum-=this.list[n].hrs
    this.list.splice(n,1)
    this.enable()
  }
  
  enable(){
    if(this.data.sum-this.hrssum==0) {
      this.hrs.controls.family.disable()
      this.hrs.controls.hr.disable()
    } else {
      this.hrs.controls.family.enable()
      this.hrs.controls.hr.enable()
    }
  }

}
