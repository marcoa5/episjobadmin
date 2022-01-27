import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';
import { NewdayComponent } from '../util/dialog/newday/newday.component';

@Component({
  selector: 'episjob-sj',
  templateUrl: './sj.component.html',
  styleUrls: ['./sj.component.scss']
})
export class SjComponent implements OnInit {

  allow:boolean=false
  pos:string=''
  customers:any[]=[]
  _rigs:any
  rigs:any
  tech:any[]=[]
  rigForm!:FormGroup
  searchForm!:FormGroup
  reportForm!:FormGroup
  signatureForm!:FormGroup
  hoursForm!:FormGroup
  day1!:FormGroup
  day2!:FormGroup
  day3!:FormGroup
  day4!:FormGroup
  day5!:FormGroup
  day6!:FormGroup
  day7!:FormGroup
  subsList:Subscription[]=[]
  sn:string=''
  spin:boolean=true
  appearance:MatFormFieldAppearance='fill'
  days:any[]=[]

  constructor(private dialog: MatDialog, private auth: AuthServiceService, private fb:FormBuilder, private day:DaytypesjService) {
    this.searchForm=this.fb.group({
      search:''
    })
    this.rigForm=fb.group({
      date: [moment(new Date()).format('YYYY-MM-DD')],
      sn: ['', Validators.required],
      pn: [''],
      model: ['', Validators.required],
      customer: ['', Validators.required],
      customer2: [''],
      customer3: [''],
      site: ['', Validators.required],
      engh: [''],
      perc1h: [''],
      perc2h: [''],
      perc3h: [''],
      type:['spe', Validators.required]
    })
    this.reportForm=this.fb.group({
      report:['', Validators.required],
      oss:['']
    }),
    this.hoursForm=fb.group({

    })
    this.day1 =fb.group({})
    this.signatureForm=fb.group({
      
    })
  }

  ngOnInit(): void {
    //const dialogRef = this.dialog.open(NewdayComponent, {panelClass: 'full-width-dialog', data: {nr:this.days.length+1,type:this.rigForm.controls.type.value}})
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('sj',this.pos) 
            this.spin=false
          }, 1);
            
        }
        
      }),
      this.auth._custI.subscribe(a=>{
        if(a) this.customers=a
      }),
      this.auth._fleet.subscribe(a=>{
        if(a){
          this._rigs=a
          this.rigs=this._rigs
        }
      }),
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  searchCust(e:any){
    let a:string = e.target.value.toLowerCase()
    this.rigs=this._rigs.filter((b:any)=>{
      return(b.sn.toLowerCase().includes(a) || b.model.toLowerCase().includes(a) || b.customer.toLowerCase().includes(a) || b.site.toLowerCase().includes(a) )
    })
    this.selRig()
  } 

  fil(a:string){
    this.rigs=this._rigs.filter((b:any)=>{
      return b.sn==a
    })
    this.selRig()
  }

  selRig(){
    if(this.rigs.length==1) {
      this.rigForm.controls.date.setValue(new Date())
      this.rigForm.controls.sn.setValue(this.rigs[0].sn)
      this.rigForm.controls.model.setValue(this.rigs[0].model)
      this.rigForm.controls.pn.setValue(this.rigs[0].in?this.rigs[0].in:'')
      this.rigForm.controls.customer.setValue(this.rigs[0].customer)
      this.rigForm.controls.customer2.setValue(this.customers[this.rigs[0].custid].c2)
      this.rigForm.controls.customer3.setValue(this.customers[this.rigs[0].custid].c3)
      this.rigForm.controls.site.setValue(this.rigs[0].site)
      this.rigForm.controls.type.setValue('spe')
    } else {
      this.rigForm.reset()
    }
  }

  /*calc(a:number){
    if(a==1) return (Math.round(1/window.innerWidth*10000)+3)
    return (Math.round(1/window.innerWidth*10000)+3)/2
  }*/

  addDay(){
    const dialogRef = this.dialog.open(NewdayComponent, {panelClass: 'full-width-dialog', data: {nr:this.days.length+1,type:this.rigForm.controls.type.value}})
    dialogRef.afterClosed().subscribe(a=>{
      if(a){
        if(this.days.length<7){
          this.days.push(this.days.length+2)
        }
      }
    })
    
  }
}
