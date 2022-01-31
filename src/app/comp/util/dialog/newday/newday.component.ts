import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';

@Component({
  selector: 'episjob-newday',
  templateUrl: './newday.component.html',
  styleUrls: ['./newday.component.scss']
})
export class NewdayComponent implements OnInit {
  subsList:Subscription[]=[]
  tech:any[]=[]
  appearance:MatFormFieldAppearance='fill'
  newDay!:FormGroup
  dayType:string=''
  constructor(private auth: AuthServiceService, public dialogRef: MatDialogRef<NewdayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private getday:DaytypesjService,
    ) { 
      this.newDay=fb.group({
        date:['', Validators.required],
        tech: ['',Validators.required],
        spov: [''],
        spol: [''],
        spsv: [''],
        spsl: [''],
        mntv: [''],
        mntl: [''],
        mfv:[''],
        mfl:[''],
        mnfv:[''],
        mnfl:[''],
        km:[''],
        spv:[''],
        off:[''],
        ofs:['']
      })
    }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  newDate(){
    let a=this.newDay.controls.date.value
    this.dayType = this.getday.dayType(a)
    console.log(this.dayType)
    switch (this.dayType){
      case 'fer': 
        this.ch(8,'spol','spov')
        this.ch(8,'spov','spol')
        this.ch(8,'spsl','spsv')
        this.ch(8,'spsv','spsl')
        this.ch(8,'mntl','mntv')
        this.ch(8,'mntv','mntl')

        break
      case 'sat':
        this.ch(16,'spsl','spsv')
        this.ch(16,'spsv','spsl')
        this.ch(8,'mntl','mntv')
        this.ch(8,'mntv','mntl')
        break
      case 'fest':
        this.ch(16,'mfl','mfv')
        this.ch(16,'mfv','mfl')
        this.ch(8,'mnfl','mnfv')
        this.ch(8,'mnfv','mnfl')
        break
    }
  }
  
  ch(n:number, a:any, b:string){
    if(this.newDay.controls[a].value+this.newDay.controls[b].value>n){
      let g=n-this.newDay.controls[b].value
      this.newDay.controls[a].setValue(g>0?g:null)
    }
  }

  chOF(n:number,a:any){
    if(this.newDay.controls[a].value>n){
      this.newDay.controls[a].setValue(n)
    }
  }
}