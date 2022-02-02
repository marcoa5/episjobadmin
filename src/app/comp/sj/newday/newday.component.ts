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
        spov: [0],
        spol: [0],
        spsv: [0],
        spsl: [0],
        mntv: [0],
        mntl: [0],
        mfv:[0],
        mfl:[0],
        mnfv:[0],
        mnfl:[0],
        km:[0],
        spv:[0],
        off:[0],
        ofs:[0]
      })
    }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
    let g = this.data.edit
    if(g){
      let f = this.newDay.controls
      f.date.setValue(new Date(g.date))
      f.tech.setValue(g.tech)
      this.newDate()
      f.spov.setValue(g.hr.spov)
      f.spol.setValue(g.hr.spol)      
      f.spsv.setValue(g.hr.spsv)
      f.spsl.setValue(g.hr.spsl)
      f.mntv.setValue(g.hr.mntv)
      f.mntl.setValue(g.hr.mntl)
      f.mfv.setValue(g.hr.mfv)
      f.mfl.setValue(g.hr.mfl)
      f.mnfv.setValue(g.hr.mnfv)
      f.mnfl.setValue(g.hr.mnfl)
      f.km.setValue(g.hr.km)
      f.spv.setValue(g.hr.spv)
      f.off.setValue(g.hr.off)
      f.ofs.setValue(g.hr.ofs)      
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  newDate(){
    let a=this.newDay.controls.date.value
    this.dayType = this.getday.dayType(a)
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

  save(){

    let a =this.newDay.value
    let data:any={
      date:a.date,
      tech:a.tech,
      hr:{
        spov: a.spov,
        spol:a.spol,
        spsv:a.spsv,
        spsl:a.spsl,
        mntv:a.mntv,
        mntl:a.mntl,
        mfv:a.mfv,
        mfl:a.mfl,
        mnfv:a.mnfv,
        mnfl:a.mnfl,
        km:a.km,
        spv:a.spv,
        off:a.off,
        ofs:a.ofs,
      }
    }
    this.dialogRef.close({data: data, info:this.data.nr})
  }
}