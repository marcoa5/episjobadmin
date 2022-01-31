import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';
import { NewdayComponent } from './newday/newday.component';
import { SignComponent } from './sign/sign.component';

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
  days:any[]=[
      {
          "date": "2022-01-24",
          "tech": "ANDREA LAINI",
          "spov": 1.75,
          "spol": 6.25,
          "spsv": 3.25,
          "spsl": 3.5,
          "mntv": "",
          "mntl": 8,
          "mfv": "",
          "mfl": "",
          "mnfv": "",
          "mnfl": "",
          "km": 1233,
          "spv": "",
          "off": 2,
          "ofs": 8,
          "datel": "24/01/2022",
          "dates": "24/01/22",
          "techs": "A.L."
      },
      {
          "date": "2022-01-25",
          "tech": "ANDREA LAINI",
          "spov": 8,
          "spol": null,
          "spsv": 3,
          "spsl": 5,
          "mntv": 8,
          "mntl": null,
          "mfv": "",
          "mfl": "",
          "mnfv": "",
          "mnfl": "",
          "km": 213,
          "spv": 2,
          "off": 2,
          "ofs": "",
          "datel": "25/01/2022",
          "dates": "25/01/22",
          "techs": "A.L."
      },
      {
          "date": "2022-01-26",
          "tech": "ANDREA LAINI",
          "spov": 2.75,
          "spol": 3.5,
          "spsv": 7.25,
          "spsl": null,
          "mntv": "",
          "mntl": "",
          "mfv": "",
          "mfl": "",
          "mnfv": "",
          "mnfl": "",
          "km": "",
          "spv": 3,
          "off": 3,
          "ofs": "",
          "datel": "26/01/2022",
          "dates": "26/01/22",
          "techs": "A.L."
      }
]
  objectKeys:any;
  signatureClosed:boolean=true;
  techSign:string=''
  custSign:string=''
  torc:string=''
  ty:string='spe'

  constructor(private dialog: MatDialog, private auth: AuthServiceService, private fb:FormBuilder, private day:DaytypesjService) {
    this.objectKeys = Object.keys;
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
    //const dial = this.dialog.open(SignComponent,{panelClass: 'sign-dialog'})
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

  addDay(i?:number){
    const dialogRef = this.dialog.open(NewdayComponent, {panelClass: 'full-width-dialog', data: {nr:i!=undefined?i+1:this.days.length+1,type:this.rigForm.controls.type.value, edit: i!=undefined?this.days[i]:undefined}})
    dialogRef.afterClosed().subscribe(rt=>{
      if(rt){
        let a = rt.data
        if(this.days.length<7){
          a.date = moment(a.date).format('YYYY-MM-DD')
          a.datel = moment(a.date).format('DD/MM/YYYY')
          a.dates = moment(a.date).format('DD/MM/YY')
          a['techs'] = a.tech.split(' ')[0].substring(0,1) + '.' + a.tech.split(' ')[1].substring(0,1) + '.'
          
          if(rt.info!=undefined){
            this.days[rt.info-1]=a
          } else {
            this.days.push(a)
          }

          
          this.days.sort((c: any, d: any) => {
            if (c.date < d.date) {
              return -1;
            } else if (c.date > d.date) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      }
    })
  }

  sign(a:string){
    this.torc=a
    this.signatureClosed=false
  }

  close(e:any){
    if(e!='close'){
      if(e[0]=='t') this.techSign=e[1]
      if(e[0]=='c') this.custSign=e[1]

    }
    this.signatureClosed=true
  }

  delete(a:number){
    this.days.splice(a,1)
  }
}
