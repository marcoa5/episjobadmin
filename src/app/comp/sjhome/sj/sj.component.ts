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
import { RiskassComponent } from './riskass/riskass.component';
import { SurveyComponent } from './survey/survey.component';
import { MakeidService } from 'src/app/serv/makeid.service';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import { ifError } from 'assert';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

export interface ma{
  [k:string]: string|number|any;
  userId: string
  author: string
  authorId: string
  vsordine: string
  nsofferta1: string
  prodotto1: string
  matricola: string
   orem1: string
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
  mfv31: string
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
  days: any
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
  //sjDraftId:string=''
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
  spin1:boolean=false
  appearance:MatFormFieldAppearance='fill'
  riskAss:any[]=[]
  file!:ma
  sent:boolean=false
  custSurv:any={
    name:'',
    s1:'',
    s2:'',
    s3:''
  }
  days:any[]=[]
  objectKeys:any;
  signatureClosed:boolean=true;
  techSign:string=''
  custSign:string=''
  torc:string=''
  userId:string=''
  technicians:any[]=[]
  behalf:any
  userName:string=''
  constructor(private router: Router, private id: MakeidService, private http: HttpClient ,private dialog: MatDialog, private auth: AuthServiceService, private fb:FormBuilder, private day:DaytypesjService, private route: ActivatedRoute) {
    this.objectKeys = Object.keys;
    this.searchForm=this.fb.group({
      search:''
    })
    this.rigForm=fb.group({
      sid: [{value: 'sjdraft' + id.makeId(5), disabled: true}],
      date: ['', Validators.required],
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
      type:['SPE', Validators.required],
      commessa:[''],
      nsofferta:[''],
      dateBPCS:[''],
      docBPCS:['']
    })
    this.reportForm=this.fb.group({
      report:['', Validators.required],
      oss:['']
    }),
    this.hoursForm=fb.group({
      check: ['', Validators.required]
    })
    this.day1 =fb.group({})
    this.signatureForm=fb.group({
      
    })
  }

  ngOnInit(): any {  

    //const dialogRef = this.dialog.open(RiskassComponent)
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.Pos
          this.userId=a.uid
          this.userName=a.Nome + ' ' + a.Cognome
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
    this.route.params.subscribe(a=>{
      if(a.id) {
        let b
        this.spin1 = true
        if(navigator.onLine && a.id.substring(0,3)=='sjs'){
          firebase.database().ref('sjDraft').child('sent').child(a.id).once('value',k=>{
            b=k.val()
            this.loadData(b,a.id)
          })
          .then(()=>this.spin1=false)
        }else {
          b= localStorage.getItem(a.id)
          if(b) this.loadData(JSON.parse(b),a.id)
          this.spin1 = false
        }

      }
    })
    this.loadTech()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadTech(){
    if(this.pos=='SU'){
      firebase.database().ref('Users').once('value',t=>{
        t.forEach(rf=>{
          if(rf.val().Pos=='tech') this.technicians.push({name: rf.val().Nome + ' ' + rf.val().Cognome, id:rf.key})
        })
      })
    }
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
      if(this.rigForm.controls.sid.value=='' || this.rigForm.controls.sid.value==null) this.rigForm.controls.sid.setValue('sjdraft' + this.id.makeId(5))
      this.rigForm.controls.date.setValue(new Date())
      this.rigForm.controls.sn.setValue(this.rigs[0].sn)
      this.rigForm.controls.model.setValue(this.rigs[0].model)
      this.rigForm.controls.pn.setValue(this.rigs[0].in?this.rigs[0].in:'')
      this.rigForm.controls.customer.setValue(this.rigs[0].customer)
      this.rigForm.controls.customer2.setValue(this.customers[this.rigs[0].custid].c2)
      this.rigForm.controls.customer3.setValue(this.customers[this.rigs[0].custid].c3)
      this.rigForm.controls.site.setValue(this.rigs[0].site)
      this.rigForm.controls.type.setValue('SPE')
    } else {
      this.rigForm.reset()
    }
  }

  addDay(i?:number){
    const dialogRef = this.dialog.open(NewdayComponent, {panelClass: 'full-width-dialog', data: {nr:i!=undefined?i+1:(this.days?this.days.length:0)+1,type:this.rigForm.controls.type.value, edit: i!=undefined?this.days[i]:undefined}})
    dialogRef.afterClosed().subscribe(rt=>{
      if(rt){
        let a = rt.data
        if(!this.days || this.days.length<7){
          a.date = moment(a.date).format('YYYY-MM-DD')
          a.datel = moment(a.date).format('DD/MM/YYYY')
          a.dates = moment(a.date).format('DD/MM/YY')
          a.day = moment(a.date).format('DD')
          a.month = moment(a.date).format('MM')
          a.year = moment(a.date).format('YYYY')

          a['techs'] = a.tech.split(' ')[0].substring(0,1) + '.' + a.tech.split(' ')[1].substring(0,1) + '.'
          if(rt.info!=undefined){
            if(rt.info-1 ==0) this.days=[]
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
          this.hoursForm.controls.check.setValue(this.days.length)
          this.saveData()
        }
      }
    })
  }

  sign(a:string){
    let dia:any
    if(a=='t') dia = this.dialog.open(RiskassComponent, {data: this.file.rs})
    if(a=='c') dia = this.dialog.open(SurveyComponent, {data:{name: this.file.contnomec, riss:this.file.rissondaggio}})
    dia.afterClosed().subscribe((b:any)=>{
      if(b){
        if(a=='t') {
          this.riskAss=b
        }
        if(a=='c') this.custSurv=b
        this.torc=a
        this.signatureClosed=false
      }
    }) 
    
  }

  close(e:any){
    if(e!='close'){
      if(e[0]=='t') this.techSign=e[1]
      if(e[0]=='c') this.custSign=e[1]
    }
    this.signatureClosed=true
    this.saveData()
  }

  delete(a:number){
    this.days.splice(a,1)
    this.hoursForm.controls.check.setValue(this.days.length==0?'':this.days.length)
  }

  saveData(last?:boolean, newId?:string){
    let i:number=1
    let h:ma = {
      userId: (this.behalf!='' && this.behalf!=undefined)?this.behalf:this.userId,
      author: this.userName,
      authorId: this.userId,
      data11: moment(this.rigForm.controls.date.value).format('DD/MM/YYYY'),
      prodotto1: this.rigForm.controls.model.value,
      matricola: this.rigForm.controls.sn.value,
      cliente11: this.rigForm.controls.customer.value,
      cliente12: this.rigForm.controls.customer2.value,
      cliente13: this.rigForm.controls.customer3.value,
      cantiere1: this.rigForm.controls.site.value,
      firmacc1: this.custSign,
      firmatt1: this.techSign,
      rappl1: this.reportForm.controls.report.value,
      oss1: this.reportForm.controls.oss.value,
      orem1: this.rigForm.controls.engh.value>0? this.rigForm.controls.engh.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."):'',
      perc11: this.rigForm.controls.perc1h.value>0?this.rigForm.controls.perc1h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."):'',
      perc21: this.rigForm.controls.perc2h.value>0?this.rigForm.controls.perc2h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."):'',
      perc31: this.rigForm.controls.perc3h.value>0?this.rigForm.controls.perc3h.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."):'',
      nsofferta1:'',
      vsordine:'',
      stdspe: this.rigForm.controls.type.value,
      apbpcs:'',
      chbpcs:'',
      docbpcs:'',
      rissondaggio:`${this.custSurv.s1}${this.custSurv.s2}${this.custSurv.s3}`,
      contnomec:this.custSurv.name,
      contfirmac:'1',
      contsondc:'1',
      elencomail:'',
      rs:this.riskAss?this.riskAss:[],
      days: this.days?this.days:[],
      tecnico11:'',dat11:'',dat12:'',dat13:'',spov11:'',spol11:'',spsv11:'',spll11:'',stdv11:'',stdl11:'',strv11:'',strl11:'',mntv11:'',mntl11:'',mfv11:'',mfl11:'',mnfv11:'',mnfl11:'',km11:'',spv11:'',off11:'',ofs11:'',
      tecnico21:'',dat21:'',dat22:'',dat23:'',spov21:'',spol21:'',spsv21:'',spll21:'',stdv21:'',stdl21:'',strv21:'',strl21:'',mntv21:'',mntl21:'',mfv21:'',mfl21:'',mnfv21:'',mnfl21:'',km21:'',spv21:'',off21:'',ofs21:'',
      tecnico31:'',dat31:'',dat32:'',dat33:'',spov31:'',spol31:'',spsv31:'',spll31:'',stdv31:'',stdl31:'',strv31:'',strl31:'',mntv31:'',mntl31:'',mfv31:'',mfl31:'',mnfv31:'',mnfl31:'',km31:'',spv31:'',off31:'',ofs31:'',
      tecnico41:'',dat41:'',dat42:'',dat43:'',spov41:'',spol41:'',spsv41:'',spll41:'',stdv41:'',stdl41:'',strv41:'',strl41:'',mntv41:'',mntl41:'',mfv41:'',mfl41:'',mnfv41:'',mnfl41:'',km41:'',spv41:'',off41:'',ofs41:'',
      tecnico51:'',dat51:'',dat52:'',dat53:'',spov51:'',spol51:'',spsv51:'',spll51:'',stdv51:'',stdl51:'',strv51:'',strl51:'',mntv51:'',mntl51:'',mfv51:'',mfl51:'',mnfv51:'',mnfl51:'',km51:'',spv51:'',off51:'',ofs51:'',
      tecnico61:'',dat61:'',dat62:'',dat63:'',spov61:'',spol61:'',spsv61:'',spll61:'',stdv61:'',stdl61:'',strv61:'',strl61:'',mntv61:'',mntl61:'',mfv61:'',mfl61:'',mnfv61:'',mnfl61:'',km61:'',spv61:'',off61:'',ofs61:'',
      tecnico71:'',dat71:'',dat72:'',dat73:'',spov71:'',spol71:'',spsv71:'',spll71:'',stdv71:'',stdl71:'',strv71:'',strl71:'',mntv71:'',mntl71:'',mfv71:'',mfl71:'',mnfv71:'',mnfl71:'',km71:'',spv71:'',off71:'',ofs71:'',
    }
    if(this.days){
      this.days.forEach(a=>{
        if(this.rigForm.controls.type.value=='STD') {
          h['spov'+i +'1']=''
          h['spol'+i +'1']=''
          h['spsv'+i +'1']=''
          h['spsl'+i +'1']=''
          h['stdv'+i +'1']=a.hr['spov']==0?'':a.hr['spov']
          h['stdl'+i +'1']=a.hr['spol']==0?'':a.hr['spol']
          h['strv'+i +'1']=a.hr['spsv']==0?'':a.hr['spsv']
          h['strl'+i +'1']=a.hr['spsl']==0?'':a.hr['spsl']
        } else {
          h['spov'+i +'1']=a.hr['spov']==0?'':a.hr['spov']
          h['spol'+i +'1']=a.hr['spol']==0?'':a.hr['spol']
          h['spsv'+i +'1']=a.hr['spsv']==0?'':a.hr['spsv']
          h['spsl'+i +'1']=a.hr['spsl']==0?'':a.hr['spsl']
          h['stdv'+i +'1']=''
          h['stdl'+i +'1']=''
          h['strv'+i +'1']=''
          h['strl'+i +'1']=''
        }
        h['mntv'+i +'1']=a.hr['mntv']==0?'':a.hr['mntv']
        h['mntl'+i +'1']=a.hr['mntl']==0?'':a.hr['mntl']
        h['mfv'+i +'1']=a.hr['mfv']==0?'':a.hr['mfv']
        h['mfl'+i +'1']=a.hr['mfl']==0?'':a.hr['mfl']
        h['mnfv'+i +'1']=a.hr['mnfv']==0?'':a.hr['mnfv']
        h['mnfl'+i +'1']=a.hr['mnfl']==0?'':a.hr['mnfl']
        h['km'+i +'1']=a.hr['km']==0?'':a.hr['km'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        h['spv'+i +'1']=a.hr['spv']==0?'':a.hr['spv']
        h['off'+i +'1']=a.hr['off']==0?'':a.hr['off']
        h['ofs'+i +'1']=a.hr['ofs']==0?'':a.hr['ofs']
    
    
    
          h['tecnico' + i + '1']=a.tech
          h['dat' + i + '1']=a.day
          h['dat' + i + '2']=a.month
          h['dat' + i + '3']=a.year
          i++
        })
    }
    let g = h.data11
    let d = parseInt(g.substring(0,2))
    let m = parseInt(g.substring(3,5))-1
    let y = parseInt(g.substring(6,10))
    let n_d = new Date(y,m,d)
    h.data_new=moment(n_d).format('YYYY-MM-DD')
    h.lastM = moment(new Date()).format('YYYYMMDDHHmmss')
    h.sjid=newId?newId:this.rigForm.controls.sid.value
    if(last) h.status='deleted'
    this.file=h
    if(this.file.sjid.substring(0,3)!='sjs') {
      localStorage.setItem(this.file.sjid, JSON.stringify(this.file))
      if(navigator.onLine) {
        firebase.database().ref('sjDraft').child('draft').child(this.file.sjid).set(this.file)
      }
    } else{
      firebase.database().ref('sjDraft').child('sent').child(this.file.sjid).set(this.file)
    }
  }

  loadData(a:any, b:string){
    if(b.substring(0,3)=='sjs'){
      this.sent=true
    }
    this.rigForm.controls.sid.setValue(b)
    this.behalf=a.userId
    this.rigForm.controls.model.setValue(a.prodotto1)
    this.rigForm.controls.sn.setValue(a.matricola)
    this.fil(a.matricola)
    setTimeout(() => {
      let g = a.data11
      let d = parseInt(g.substring(0,2))
      let m = parseInt(g.substring(3,5))-1
      let y = parseInt(g.substring(6,10))
      let n_d = new Date(y,m,d)
      this.rigForm.controls.date.setValue(n_d)
    }, 100);
    this.rigForm.controls.customer.setValue(a.cliente11)
    this.rigForm.controls.customer2.setValue(a.cliente12)
    this.rigForm.controls.customer3.setValue(a.cliente13)
    this.rigForm.controls.site.setValue(a.cantiere1)
    this.rigForm.controls.type.setValue(a.stdspe)
    this.custSign=a.firmacc1
    this.techSign=a.firmatt1
    this.reportForm.controls.report.setValue(a.rappl1)
    this.reportForm.controls.oss.setValue(a.oss1)
    this.rigForm.controls.engh.setValue(parseInt(a. orem1.replace(/[.]/g,'')))
    this.rigForm.controls.perc1h.setValue(parseInt(a.perc11.replace(/[.]/g,'')))
    this.rigForm.controls.perc2h.setValue(parseInt(a.perc21.replace(/[.]/g,'')))
    this.rigForm.controls.perc3h.setValue(parseInt(a.perc31.replace(/[.]/g,'')))

    this.custSurv.s1=a.rissondaggio.substring(0,1)
    this.custSurv.s2=a.rissondaggio.substring(1,2)
    this.custSurv.s3=a.rissondaggio.substring(2,3)
    this.custSurv.name= a.contnomec
    //elencomail:'',
    this.riskAss=a.rs
    this.days=a.days
    this.hoursForm.controls.check.setValue(this.days?this.days.length:0)
  }

    send(){
      localStorage.getItem(this.rigForm.controls.sid.value)
      let g:string = 'sjsent' + this.id.makeId(5)
      this.saveData(true)
      this.saveData(true,g)
      localStorage.setItem(g, JSON.stringify(this.file))
      this.router.navigate(['sj'])
    }

    chLen(e:any){
      if(e.target.value.length==6 && e.key!="Backspace" && e.key!="Delete" && e.key!='ArrowLeft' && e.key!='ArrowRight') return false
      return true
    }
}
