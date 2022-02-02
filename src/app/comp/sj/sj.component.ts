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
  [k:string]: string|number;
  vsordine: string
  nsofferta1: string
  prodotto1: string
  matricola: string
  orem: string
  perc11: string
  perc21: string
  perc31: string
  data11: string
  cliente11: string
  cliente12: string
  cliente13: string
  cantiere1: string
  rappl1: string
  oss1: string
  stdspe: string
  apbpcs: string
  chbpcs: string
  docbpcs: string
  rissondaggio: string
  contnomec: string
  contfirmac: string
  contsondc: string
  sondaggio: string
  elencomail: string
  firmatt1: string
  firmacc1: string
  rs: any
  tecnico11: string
  dat11: string
  dat12: string
  dat13: string
  spov11: string
  spol11: string
  spsv11: string
  spll11: string
  stdv11: string
  stdl11: string
  strv11: string
  strl11: string
  mntv11: string
  mntl11: string
  mfv11: string
  mfl11: string
  mnfv11: string
  mnfl11: string
  km11: string
  spv11: string
  off11: string
  ofs11: string
  tecnico21: string
  dat21: string
  dat22: string
  dat23: string
  spov21: string
  spol21: string
  spsv21: string
  spll21: string
  stdv21: string
  stdl21: string
  strv21: string
  strl21: string
  mntv21: string
  mntl21: string
  mfv21: string
  mfl21: string
  mnfv21: string
  mnfl21: string
  km21: string
  spv21: string
  off21: string
  ofs21: string
  tecnico31: string
  dat31: string
  dat32: string
  dat33: string
  spov31: string
  spol31: string
  spsv31: string
  spll31: string
  stdv31: string
  stdl31: string
  strv31: string
  strl31: string
  mntv31: string
  mntl31: string
  mfv3: string
  mfl31: string
  mnfv31: string
  mnfl31: string
  km31: string
  spv31: string
  off31: string
  ofs31: string
  tecnico41: string
  dat41: string
  dat42: string
  dat43: string
  spov41: string
  spol41: string
  spsv41: string
  spll41: string
  stdv41: string
  stdl41: string
  strv41: string
  strl41: string
  mntv41: string
  mntl41: string
  mfv41: string
  mfl41: string
  mnfv41: string
  mnfl41: string
  km41: string
  spv41: string
  off41: string
  ofs41: string
  tecnico51: string
  dat51: string
  dat52: string
  dat53: string
  spov51: string
  spol51: string
  spsv51: string
  spll51: string
  stdv51: string
  stdl51: string
  strv51: string
  strl51: string
  mntv51: string
  mntl51: string
  mfv51: string
  mfl51: string
  mnfv51: string
  mnfl51: string
  km51: string
  spv51: string
  off51: string
  ofs51: string
  tecnico61: string
  dat61: string
  dat62: string
  dat63: string
  spov61: string
  spol61: string
  spsv61: string
  spll61: string
  stdv61: string
  stdl61: string
  strv61: string
  strl61: string
  mntv61: string
  mntl61: string
  mfv61: string
  mfl61: string
  mnfv61: string
  mnfl61: string
  km61: string
  spv61: string
  off61: string
  ofs61: string
  tecnico71: string
  dat71: string
  dat72: string
  dat73: string
  spov71: string
  spol71: string
  spsv71: string
  spll71: string
  stdv71: string
  stdl71: string
  strv71: string
  strl71: string
  mntv71: string
  mntl71: string
  mfv71: string
  mfl71: string
  mnfv71: string
  mnfl71: string
  km71: string
  spv71: string
  off71: string
  ofs71: string
}

@Component({
  selector: 'episjob-sj',
  templateUrl: './sj.component.html',
  styleUrls: ['./sj.component.scss']
})
export class SjComponent implements OnInit {
  blankSign: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAADECAIAAACDVLa7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ8SURBVHhe7dQxAQAADMOg+TfdicgLIrgBEGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgESjAIlGARKNAiQaBUg0CpBoFCDRKECiUYBEowCJRgESjQIkGgVINAqQaBQg0ShAolGARKMAiUYBEo0CJBoFSDQKkGgUINEoQKJRgGB79ZvKtJ8GYLAAAAAASUVORK5CYII='
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
  days:any[]=[/*
    {
        "date": "2022-02-02",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 1,
            "spol": 1,
            "spsv": 1,
            "spsl": 1,
            "mntv": 1,
            "mntl": 1,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 1,
            "spv": 1,
            "off": 1,
            "ofs": 1
        },
        "datel": "02/02/2022",
        "dates": "02/02/22",
        "day": "02",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-03",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 2,
            "spol": 2,
            "spsv": 2,
            "spsl": 2,
            "mntv": 2,
            "mntl": 2,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 2,
            "spv": 2,
            "off": 2,
            "ofs": 2
        },
        "datel": "03/02/2022",
        "dates": "03/02/22",
        "day": "03",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-04",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 3,
            "spol": 3,
            "spsv": 3,
            "spsl": 3,
            "mntv": 3,
            "mntl": 3,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 3,
            "spv": 3,
            "off": 3,
            "ofs": 3
        },
        "datel": "04/02/2022",
        "dates": "04/02/22",
        "day": "04",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-07",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 4,
            "spol": 4,
            "spsv": 4,
            "spsl": 4,
            "mntv": 4,
            "mntl": 4,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 4,
            "spv": 4,
            "off": 4,
            "ofs": 4
        },
        "datel": "07/02/2022",
        "dates": "07/02/22",
        "day": "07",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-08",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 5,
            "spol": 3,
            "spsv": 5,
            "spsl": 3,
            "mntv": 5,
            "mntl": 3,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 5,
            "spv": 5,
            "off": 5,
            "ofs": 5
        },
        "datel": "08/02/2022",
        "dates": "08/02/22",
        "day": "08",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-09",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 6,
            "spol": 2,
            "spsv": 6,
            "spsl": 2,
            "mntv": 6,
            "mntl": 2,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 6,
            "spv": 6,
            "off": 6,
            "ofs": 6
        },
        "datel": "09/02/2022",
        "dates": "09/02/22",
        "day": "09",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    },
    {
        "date": "2022-02-11",
        "tech": "ANDREA LAINI",
        "hr": {
            "spov": 7,
            "spol": 1,
            "spsv": 7,
            "spsl": 1,
            "mntv": 7,
            "mntl": 1,
            "mfv": 0,
            "mfl": 0,
            "mnfv": 0,
            "mnfl": 0,
            "km": 7,
            "spv": 7,
            "off": 7,
            "ofs": 7
        },
        "datel": "11/02/2022",
        "dates": "11/02/22",
        "day": "11",
        "month": "02",
        "year": "2022",
        "techs": "A.L."
    }*/
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
          a.day = moment(a.date).format('DD')
          a.month = moment(a.date).format('MM')
          a.year = moment(a.date).format('YYYY')

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

  }

  openT(){
    let h:ma = {
      data11: moment(this.rigForm.controls.date.value).format('DD/MM/YYYY'),
      prodotto1: this.rigForm.controls.model.value,
      matricola: this.rigForm.controls.sn.value,
      cliente11: this.rigForm.controls.customer.value,
      cliente12: this.rigForm.controls.customer2.value,
      cliente13: this.rigForm.controls.customer3.value,
      cantiere1: this.rigForm.controls.site.value,
      firmacc1: this.custSign? this.custSign: this.blankSign,
      firmatt1: this.techSign? this.techSign: this.blankSign,
      rappl1: this.reportForm.controls.report.value,
      oss1: this.reportForm.controls.oss.value,
      orem: this.rigForm.controls.engh.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      perc11: this.rigForm.controls.perc1h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      perc21: this.rigForm.controls.perc2h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      perc31: this.rigForm.controls.perc3h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      nsofferta1:'',
      vsordine:'',
      stdspe:'',
      apbpcs:'',
      chbpcs:'',
      docbpcs:'',
      rissondaggio:'',
      contnomec:'',
      contfirmac:'',
      contsondc:'',
      sondaggio:'',
      elencomail:'',
      rs:'',
      tecnico11:'',
      dat11:'',
      dat12:'',
      dat13:'',
      spov11:'',
      spol11:'',
      spsv11:'',
      spll11:'',
      stdv11:'',
      stdl11:'',
      strv11:'',
      strl11:'',
      mntv11:'',
      mntl11:'',
      mfv11:'',
      mfl11:'',
      mnfv11:'',
      mnfl11:'',
      km11:'',
      spv11:'',
      off11:'',
      ofs11:'',
      tecnico21:'',
      dat21:'',
      dat22:'',
      dat23:'',
      spov21:'',
      spol21:'',
      spsv21:'',
      spll21:'',
      stdv21:'',
      stdl21:'',
      strv21:'',
      strl21:'',
      mntv21:'',
      mntl21:'',
      mfv21:'',
      mfl21:'',
      mnfv21:'',
      mnfl21:'',
      km21:'',
      spv21:'',
      off21:'',
      ofs21:'',
      tecnico31:'',
      dat31:'',
      dat32:'',
      dat33:'',
      spov31:'',
      spol31:'',
      spsv31:'',
      spll31:'',
      stdv31:'',
      stdl31:'',
      strv31:'',
      strl31:'',
      mntv31:'',
      mntl31:'',
      mfv3:'',
      mfl31:'',
      mnfv31:'',
      mnfl31:'',
      km31:'',
      spv31:'',
      off31:'',
      ofs31:'',
      tecnico41:'',
      dat41:'',
      dat42:'',
      dat43:'',
      spov41:'',
      spol41:'',
      spsv41:'',
      spll41:'',
      stdv41:'',
      stdl41:'',
      strv41:'',
      strl41:'',
      mntv41:'',
      mntl41:'',
      mfv41:'',
      mfl41:'',
      mnfv41:'',
      mnfl41:'',
      km41:'',
      spv41:'',
      off41:'',
      ofs41:'',
      tecnico51:'',
      dat51:'',
      dat52:'',
      dat53:'',
      spov51:'',
      spol51:'',
      spsv51:'',
      spll51:'',
      stdv51:'',
      stdl51:'',
      strv51:'',
      strl51:'',
      mntv51:'',
      mntl51:'',
      mfv51:'',
      mfl51:'',
      mnfv51:'',
      mnfl51:'',
      km51:'',
      spv51:'',
      off51:'',
      ofs51:'',
      tecnico61:'',
      dat61:'',
      dat62:'',
      dat63:'',
      spov61:'',
      spol61:'',
      spsv61:'',
      spll61:'',
      stdv61:'',
      stdl61:'',
      strv61:'',
      strl61:'',
      mntv61:'',
      mntl61:'',
      mfv61:'',
      mfl61:'',
      mnfv61:'',
      mnfl61:'',
      km61:'',
      spv61:'',
      off61:'',
      ofs61:'',
      tecnico71:'',
      dat71:'',
      dat72:'',
      dat73:'',
      spov71:'',
      spol71:'',
      spsv71:'',
      spll71:'',
      stdv71:'',
      stdl71:'',
      strv71:'',
      strl71:'',
      mntv71:'',
      mntl71:'',
      mfv71:'',
      mfl71:'',
      mnfv71:'',
      mnfl71:'',
      km71:'',
      spv71:'',
      off71:'',
      ofs71:'',
    }
    let i:number = 1
    this.days.forEach(a=>{
    if(this.rigForm.controls.type.value=='std') {
      h['spov'+i +'1']=''
      h['spol'+i +'1']=''
      h['spsv'+i +'1']=''
      h['spsl'+i +'1']=''
      h['stdv'+i +'1']=a.hr['spov']
      h['stdl'+i +'1']=a.hr['spol']
      h['strv'+i +'1']=a.hr['spsv']
      h['strl'+i +'1']=a.hr['spsl']
    } else {
      h['spov'+i +'1']=a.hr['spov']
      h['spol'+i +'1']=a.hr['spol']
      h['spsv'+i +'1']=a.hr['spsv']
      h['spsl'+i +'1']=a.hr['spsl']
      h['stdv'+i +'1']=''
      h['stdl'+i +'1']=''
      h['strv'+i +'1']=''
      h['strl'+i +'1']=''
    }
    h['mntv'+i +'1']=a.hr['mntv']
    h['mntl'+i +'1']=a.hr['mntl']
    h['mfv'+i +'1']=a.hr['mfv']
    h['mfl'+i +'1']=a.hr['mfl']
    h['mnfv'+i +'1']=a.hr['mnfv']
    h['mnfl'+i +'1']=a.hr['mnfl']
    h['km'+i +'1']=a.hr['km']
    h['spv'+i +'1']=a.hr['spv']
    h['off'+i +'1']=a.hr['off']
    h['ofs'+i +'1']=a.hr['ofs']



      h['tecnico' + i + '1']=a.tech
      h['dat' + i + '1']=a.day
      h['dat' + i + '2']=a.month
      h['dat' + i + '3']=a.year
      i++
    })

    let url = 'https://episjobreq.herokuapp.com/sjTemplate'//'http://localhost:3001/sjTemplate'
    this.http.post(url, h /*{params:params}*/).subscribe(a=>{
      const dia = this.dialog.open(TemplComponent, {panelClass: 'templ-dialog',data:a})
    })
  }
}
