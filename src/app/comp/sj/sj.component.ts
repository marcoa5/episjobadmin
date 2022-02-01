import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';
import { NewdayComponent } from './newday/newday.component';
import { TemplComponent } from './templ/templ.component';

export interface ma{
  commessa1?: string
  vsordine?: string
  nsofferta1?: string
  prodotto1?: string
  matricola?: string
  orem1?: number
  perc11?: number
  perc21?: number
  perc31?: number
  data11?: string
  cliente11?: string
  cliente12?: string
  cliente13?: string
  cantiere1?: string
  rappl1?: string
  oss1?: string
  stdspe?: string
  apbpcs?: string
  chbpcs?: string
  docbpcs?: string
  rissondaggio?: string
  contnomec?: string
  contfirmac?: string
  contsondc?: string
  sondaggio?: string
  elencomail?: string
  firmatt1?: string
  firmacc1?: string
  rs?: any
  tecnico11?: string
  dat11?: string
  dat12?: string
  dat13?: string
  spov11?: number
  spol11?: number
  spsv11?: number
  spll11?: number
  stdv11?: number
  stdl11?: number
  strv11?: number
  strl11?: number
  mntv11?: number
  mntl11?: number
  mfv11?: number
  mfl11?: number
  mnfv11?: number
  mnfl11?: number
  km11?: number
  spv11?: number
  off11?: number
  ofs11?: number
  tecnico21?: string
  dat21?: string
  dat22?: string
  dat23?: string
  spov21?: number
  spol21?: number
  spsv21?: number
  spll21?: number
  stdv21?: number
  stdl21?: number
  strv21?: number
  strl21?: number
  mntv21?: number
  mntl21?: number
  mfv21?: number
  mfl21?: number
  mnfv21?: number
  mnfl21?: number
  km21?: number
  spv21?: number
  off21?: number
  ofs21?: number
  tecnico31?: string
  dat31?: string
  dat32?: string
  dat33?: string
  spov31?: number
  spol31?: number
  spsv31?: number
  spll31?: number
  stdv31?: number
  stdl31?: number
  strv31?: number
  strl31?: number
  mntv31?: number
  mntl31?: number
  mfv3?: number
  mfl31?: number
  mnfv31?: number
  mnfl31?: number
  km31?: number
  spv31?: number
  off31?: number
  ofs31?: number
  tecnico41?: string
  dat41?: string
  dat42?: string
  dat43?: string
  spov41?: number
  spol41?: number
  spsv41?: number
  spll41?: number
  stdv41?: number
  stdl41?: number
  strv41?: number
  strl41?: number
  mntv41?: number
  mntl41?: number
  mfv41?: number
  mfl41?: number
  mnfv41?: number
  mnfl41?: number
  km41?: number
  spv41?: number
  off41?: number
  ofs41?: number
  tecnico51?: string
  dat51?: string
  dat52?: string
  dat53?: string
  spov51?: number
  spol51?: number
  spsv51?: number
  spll51?: number
  stdv51?: number
  stdl51?: number
  strv51?: number
  strl51?: number
  mntv51?: number
  mntl51?: number
  mfv51?: number
  mfl51?: number
  mnfv51?: number
  mnfl51?: number
  km51?: number
  spv51?: number
  off51?: number
  ofs51?: number
  tecnico61?: string
  dat61?: string
  dat62?: string
  dat63?: string
  spov61?: number
  spol61?: number
  spsv61?: number
  spll61?: number
  stdv61?: number
  stdl61?: number
  strv61?: number
  strl61?: number
  mntv61?: number
  mntl61?: number
  mfv61?: number
  mfl61?: number
  mnfv61?: number
  mnfl61?: number
  km61?: number
  spv61?: number
  off61?: number
  ofs61?: number
  tecnico71?: string
  dat71?: string
  dat72?: string
  dat73?: string
  spov71?: number
  spol71?: number
  spsv71?: number
  spll71?: number
  stdv71?: number
  stdl71?: number
  strv71?: number
  strl71?: number
  mntv71?: number
  mntl71?: number
  mfv71?: number
  mfl71?: number
  mnfv71?: number
  mnfl71?: number
  km71?: number
  spv71?: number
  off71?: number
  ofs71?: number
}

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

  constructor(private http: HttpClient ,private dialog: MatDialog, private auth: AuthServiceService, private fb:FormBuilder, private day:DaytypesjService) {
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

  save(){
    let ex: ma={
      
    }
  }

  openT(){
    /*let params= new HttpParams()
    .set('sn', 'AVO10A008')*/
    let url = 'http://localhost:3001/sjTemplate'
    this.http.get(url/*, {params:params}*/).subscribe(a=>{
      console.log(a)
      const dia = this.dialog.open(TemplComponent, {panelClass: 'templ-dialog',data:a})
    })
  }
}
