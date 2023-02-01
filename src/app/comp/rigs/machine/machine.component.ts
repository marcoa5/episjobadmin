import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment'
import 'chartjs-adapter-moment';
import { BackService } from '../../../serv/back.service'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { InputhrsComponent } from '../../util/dialog/inputhrs/inputhrs.component'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component'
import { ComdatedialogComponent } from '../../util/dialog/comdatedialog/comdatedialog.component'
import {Clipboard} from '@angular/cdk/clipboard';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { NewsubeqComponent } from './subeq/newsubeq/newsubeq.component';
import { SubeddialogComponent } from './subeq/subeddialog/subeddialog.component';
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { NewpartsrequestComponent } from '../../parts/newpartsrequest/newpartsrequest.component';
import { MakeidService } from 'src/app/serv/makeid.service';
import { ExcelService } from 'src/app/serv/excelexport.service'
import * as XLSX from 'xlsx-js-style'
import { SumWsHrsService } from 'src/app/serv/sum-ws-hrs.service';

export interface hrsLabel {
  lab: string
  value: any
  click: any
  url: any
  miniIco?: any
}
   
export interface output {
  Date: Date|undefined
  sn: string|undefined
  Model: string|undefined
  Originator: string|undefined
  ShipAddress:string|undefined
  pn:string|undefined
  Description:string|undefined
  LLP:number|null
  Qty:number|null
  Tot:number|null
}

@Component({
  selector: 'episjob-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {
  change:number=0
  cCom:any=0;
  valore: any='';
  model:string='';
  customer:string='';
  id:string='';
  site:string='';
  in:string='';
  docBpcs:string=''
  data:any[]=[]
  dataAvg:any[]=[]
  datafil:any[]=[]
  dataCha:any
  g1:Chart | null | undefined
  g2:Chart | null | undefined
  rigLabels: hrsLabel[]=[]
  _rigLabels: hrsLabel[]=[]
  hrsLabels: hrsLabel[]=[]
  shipToLabels: hrsLabel[]=[]
  pos:string=''
  iniz:any=''
  day:any
  allow:boolean=true
  inizio!:Date
  fine:Date=new Date()
  infoH:any='Running Hours'
  infoCommisioned:string=''
  dataCom:string=''
  engAvg:string=''
  impAvg:any[]=[]
  showAdd:boolean=false
  lr:string=''
  chSj: boolean=false
  sjList:any[]=[]
  sortT:boolean=true
  sortSJ:boolean=true
  SElist:any[]=[]
  sortParts:boolean=true
  name:string=''
  elenco:any[]=[]
  access:any[]=[]
  area:string=''
  partReqList:any[]=[]
  contract:any[]=[]
  files:any[]=[]
  info:any={}
  userId:string=''
  subsList:Subscription[]=[]
  
  constructor(private sumHr:SumWsHrsService, private excel:ExcelService , private makeid: MakeidService, private auth: AuthServiceService, private dialog: MatDialog, public route: ActivatedRoute, public bak: BackService, public router:Router, private clipboard: Clipboard) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    Chart.register()
    this.subsList.push(
      this.auth._userData.subscribe((a: { Pos: string; Nome: string; Cognome: string; Area: string; uid:string })=>{
        this.pos=a.Pos
        this.name = a.Nome + ' ' + a.Cognome
        this.area=a.Area
        this.userId=a.uid
      })
    )
    this.start() 
  }

  start(){
    this.route.params.subscribe(r=>{
      this.valore=r.sn
      if(this.auth.acc('MachinePermissions')){
        firebase.database().ref('RigAuth').child(this.valore).child('a'+this.area).once('value',gt=>{
          if(gt.val()=='1') {
            this.allow=this.auth.allow('All',this.pos)
          } else {this.allow=false}
        })
      } else {
        this.allow=this.auth.allow('All',this.pos)
      }
    })
    this.f(1)
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  f(a:number){
    firebase.database().ref('MOL').child(this.valore).once('value',x=>{
      this.site = x.val().site
      this.model=x.val().model
      this.customer=x.val().customer
      this.id = x.val().custid
      this.docBpcs=x.val().docbpcs
      this.in = x.val().in
    })
    .then(()=>{
      this.loadSubEquipment()
      this.loadContract()
      this.loadWsFiles()
      this.loadData()
      .then(()=>{
        if(this.data[0]) this.inizio=this.data[0].x
        this._rigLabels=[
          {value:this.valore, lab:'Serial Nr.',click:'',url:'', miniIco:'tag'},
          {value:this.customer, lab:'Customer',click: (this.pos!='sales')? this.id:'',url: this.pos!='sales'?'cliente':'', miniIco:'person'},
        ]
        if(this.site!='') this._rigLabels.push({value:this.site, lab:'Site',click:'',url:'', miniIco:'location_on'})
        if(this.in) this._rigLabels.splice(1,0,{value: this.in, lab:'Part Nr.',click:'', url:'', miniIco:'tag'})
        
        if(this.data[0] && this.data[0].y=='c' && this.data[0]!=undefined) {
          this._rigLabels.push({value:moment(this.data[0].x).format("DD/MM/YYYY"), lab:'Commissioning Date',click:'',url:'', miniIco:'event'})
          this.showAdd=false
        }
        if(this.pos!='customer'){
          this.shipToInfo().then((b:any)=>{
            if(Object.keys(b).length>0){
              Object.keys(b).forEach(a=>{
                console.log(a)
                if(a.substring(0,9)=='Ship To c') {
                  this._rigLabels.push({lab: a, value:b[a],click:'',url:'', miniIco:'person'})
                } else if(a=='Ship To Address') {
                  this._rigLabels.push({lab: a, value:b[a],click:'',url:'', miniIco:'map'})
                }
                this.rigLabels=this._rigLabels
              })
            } else{
              this.rigLabels=this._rigLabels
            }
          })
        } else{
          this.rigLabels=this._rigLabels
        }
        if(this.data[0] && this.data[0].y!='c' && this.data[0]!=undefined) {
          this.showAdd=true
        }
        //if(a==0) this.filter(new Date(moment(new Date()).subtract(3,'months').format('YYYY-MM-DD')),new Date())
        if(a==1) this.filter(this.inizio,this.fine)
        this.checkComm()
      })
    }) 
  }

  lastRead(){
    if(this.cCom>0 && this.datafil[0].y!='c') {
      this.hrsLabels.push({
        value:moment(this.data[this.data.length-1].x).format('DD/MM/YYYY'),
        lab: 'Last Read',
        click:'',
        url:'',
        miniIco: 'timer'
      })
    } 
  }

  loadData(){
    return new Promise((res,rej)=>{
      this.data=[]
      firebase.database().ref('Hours/' + this.valore).on('value',f=>{
        if(f.val()==null) {
          this.showAdd=true
          res('ok')
        }
        if(f.val()!=null || f.val()!=undefined){
          let r = Object.keys(f.val()).length
          if(r==0) rej('failed')
          f.forEach(g=>{
            var h:any
            if(g.key){
              let anno = parseInt(g.key.substring(0,4)) 
              let mese = parseInt(g.key.substring(4,6))-1 
              let giorno = parseInt(g.key.substring(6,8)) 
              this.day = moment(new Date(anno,mese,giorno)).format("YYYY-MM-DD")
              h={x:this.day, y:g.val().orem, y1:g.val().perc1, y2:g.val().perc2, y3:g.val().perc3}
            }
            if(h!=undefined) this.data.push(h)
            if(this.data.length == r) {res('ok')}
          })
        }
      })
    })
  }

  loadCharts(){
    this.dataCha=this.datafil.map(f=>{
      return {
        x: f.x,
        y: f.y!=undefined? parseInt(f.y):undefined,
        y1: f.y1!=undefined? parseInt(f.y1):undefined,
        y2: f.y2!=undefined? parseInt(f.y2):undefined,
        y3: f.y3!=undefined? parseInt(f.y3):undefined
      }
    })
    setTimeout(() => {
      if(this.dataCha.length>0) {
        this.calcolaOrem()
        this.calcolaPerc1()
      }
    }, 500);
  }

  filter(i:any,f:any){
    let a1=moment(new Date(i)).format('YYYYMMDD')
    let a2=moment(new Date(f)).format('YYYYMMDD')
    this.datafil = this.data.filter(d=>{
      let a3=moment(new Date(d.x)).format('YYYYMMDD')
      return a3>=a1 && a3<=a2
    })
    if(this.datafil.length>0){
      this.datafil.forEach((item,i)=>{
        if(this.datafil[0].y=='c') {
          this.datafil[0]={
            x: this.datafil[0].x,
            y: 0,
            y1: (this.datafil[1] && this.datafil[1].y1>0)? 0 : 0,
            y2: (this.datafil[1] && this.datafil[1].y2>0)? 0 : undefined,
            y3: (this.datafil[1] && this.datafil[1].y3>0)? 0 : undefined,
          }
      }
        if(item.y=='0') item.y=undefined
        if(item.y1=='0') item.y1=undefined
        if(item.y2=='0') item.y2=undefined
        if(item.y3=='0') item.y3=undefined
      })
      this.loadCharts()
      this.avgHrs()
      if (this.data.length>0){
        this.hrsLabels=[  
          {miniIco:'timer', value:this.engAvg!=''?`${this.th(this.data[this.data.length-1].y)} ${this.engAvg}`:this.th(this.data[this.data.length-1].y),lab: 'Engine Hrs',click:'',url:''},
          {miniIco:'timer', value:this.impAvg && (this.impAvg[1]==1||this.impAvg[1]==2||this.impAvg[1]==3)?`${this.th(this.data[this.data.length-1].y1)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y1),lab: 'Percussion 1',click:'',url:''},
          {miniIco:'timer', value:this.impAvg && (this.impAvg[1]==3||this.impAvg[1]==2)?`${this.th(this.data[this.data.length-1].y2)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y2),lab: 'Percussion 2',click:'',url:''},
          {miniIco:'timer', value:this.impAvg && this.impAvg[1]==3?`${this.th(this.data[this.data.length-1].y3)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y3),lab: 'Percussion 3',click:'',url:''}
        ]  
      }
      this.lastRead()
    }
    this.loadServiceJobs(i,f)
  }

  loadServiceJobs(i:any, f:any){
    firebase.database().ref('Saved').child(this.valore).once('value',h=>{
      let iniz = moment(i).format('YYYYMMDD')
      let fine = moment(f).format('YYYYMMDD')
      if(fine<iniz) fine=(parseInt(iniz)+1).toString()
      this.sjList=[]
      h.forEach(g=>{
        if(g.key && g.key.substring(0,8)>=iniz && g.key.substring(0,8)<=fine){
          let r = g.val()
          r.datafin = g.key.substring(0,4) + '-' + g.key.substring(4,6)+ '-' + g.key.substring(6,8)
          r.path = g.key
          this.sjList.push(r)
        }        
      })
    })
  }

  loadSubEquipment(){
    firebase.database().ref('SubEquipment').child(this.valore).on('value',a=>{
      this.SElist=[]
      if(a.val()!=null){
        a.forEach(b=>{
          let c = b.val()
          c.id=b.key
          c.rigsn=a.key
          this.SElist.push(c)
        })
      }
    })
  }

  res(e:any){
    /*this.calcolaOrem()
    this.calcolaPerc1()*/
  }

  de(a:string){
    if(this.auth.acc('SURights')){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(DeldialogComponent, {
        data: {name: a.replace(/\-/g,'')}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.auth.acc('SURights')) {
          firebase.database().ref(`Hours/${this.valore}/${result}`).remove()
          this.f(1)
          //this.location.back()
        }
      });
    }
  }

    up(e:any){
      let a:string = e[0]
      let b:any = e[1]
      let c:string = e[2]
      if(this.auth.acc('SURights')){
        const dialogconf = new MatDialogConfig();
        dialogconf.disableClose=false;
        dialogconf.autoFocus=false;
        const dialogRef = this.dialog.open(InputhrsComponent, {
          data: {hr: a!=undefined? a : 0}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result!=undefined && this.auth.acc('SURights')) {
            firebase.database().ref(`Hours/${this.valore}/${b.replace(/\-/g,'')}`).child(c).set(result)
            this.f(1)
          }
        });
      }
    }

    contr(){
      return false
    }

    go(e:any){
      this.router.navigate(['newrig',{name:this.valore}])
    }

    rigInfo(){
      return `Rig info - ${this.valore} ${this.in!='' && this.in!=undefined? '(' + this.in  + ')' : ''}`
    }

    th(a:any){
      if(a && a.toString()=='c') return 0
      if(a){
        a=a.toString()
      let b = a.toString().length
      if(b<4) return a
      if(b>3 && b<7) return `${a.substring(0,b-3)}.${a.substring(b-3,b)}`
      if(b>6 && b<10) return `${a.substring(0,b-6)}.${a.substring(b-6,b-3)}.${a.substring(b-3,b)}`
      }
    }


  calcolaOrem(){
    if (this.g1) this.g1.destroy()
    var canvas = <HTMLCanvasElement> document.getElementById('orem')
    var ctx:any 
    if (canvas!=null) ctx = canvas.getContext('2d')
    if(ctx){
      this.g1 = new Chart(ctx, {
        type: 'line',
        data: {
          datasets:[{
            label: "Engine Hours",
            data:this.dataCha,
            borderColor: 'rgb(66,85,99)',
            pointBackgroundColor:'rgb(66,85,99)',
            backgroundColor: 'rgb(255,199,44)',
            fill: true,
          }]
        },
        options: {
            scales: {
              x:{
                type:'time',
                time:{
                  unit:'month'
                }
              },
            },
            maintainAspectRatio: false,
            responsive: true,
        }
    });
    }
  }

  chPerc(){
    let i:boolean =false
    this.dataCha.forEach((e:any) => {
      if(e.y1!=undefined && e.y1!=0) i=true
    });
    return i
  }

  calcolaPerc1(){
    if (this.g2) this.g2.destroy()
    var canvas = <HTMLCanvasElement> document.getElementById('perc1')
    var ctx 
    if (canvas!=null) ctx = canvas.getContext('2d')
    let col1:string='rgb(112,173,71)'
    let col2:string='rgb(91,155,213)'
    let col3:string='rgb(237,125,49)'
    if(ctx){
      this.g2 = new Chart(ctx, {
        type: 'line',
        data: {
          datasets:[{
            label: "Perc1",
            data: this.dataCha,
            parsing: {
              yAxisKey: 'y1'
            },
            borderColor: col1,
            pointBackgroundColor:col1,
          },
          {
            label: "Perc2",
            data:this.dataCha,
            parsing: {
              yAxisKey: 'y2'
            },
            
            borderColor: col2,
            pointBackgroundColor:col1,
          },
          {
            label: "Perc3",
            data:this.dataCha,
            parsing: {
              yAxisKey: 'y3'
            },
            borderColor: col3,
            pointBackgroundColor:col1,
          }
        ]
        },
        options: {
            scales: {
                x:{
                  type:'time',
                  time:{
                    unit:'month'
                  }
                },
            },
            maintainAspectRatio: false,
            responsive: true,
        }
    });
    }
  }

  async readD(e:any){
    this.inizio=e[0]
    this.fine=e[1]
    await this.filter(e[0],e[1]) 
    this.loadPartsReq()
    this.checkComm()
  }

  avgHrs(){
    this.dataAvg= this.datafil
    let avg, avg1, num, num1, den, ch
    if(this.data[0]!=undefined && this.dataAvg[this.dataAvg.length-1]!=undefined && this.dataAvg.length>1) {
      num = (this.dataAvg[this.dataAvg.length-1].y-this.dataAvg[0].y)
      den=moment(new Date(this.dataAvg[this.dataAvg.length-1].x)).diff(moment(new Date(this.dataAvg[0].x)))/1000/60/60/24
      avg=num==0?0:this.th((Math.round(num/den*365)))
      let n  =this.dataAvg.length-1
      if(this.dataAvg[n].y3 && this.dataAvg[n].y3>=0) {
        ch=3
        num1 = (this.dataAvg[n].y1*1+this.dataAvg[n].y2*1+this.dataAvg[n].y3*1-this.dataAvg[0].y1*1-this.dataAvg[0].y2*1-this.dataAvg[0].y3*1)/3
        avg1=this.th((Math.round(num1/den*365)))
      }else if(this.dataAvg[n].y2 && this.dataAvg[n].y2>=0) {
        ch=2
        num1 = (this.dataAvg[n].y1*1+this.dataAvg[n].y2*1-this.dataAvg[0].y1*1-this.dataAvg[0].y2*1)/2
        avg1=this.th((Math.round(num1/den*365)))
      } else if(this.dataAvg[n].y1 && this.dataAvg[n].y1>=0) {
        ch=1
        num1 = (this.dataAvg[n].y1*1-this.dataAvg[0].y1*1)
        avg1=this.th((Math.round(num1/den*365)))
      }
    }
    
    if(avg!=undefined) {
      this.engAvg= '(Avg: ' + avg + ' h/y)'
    } else {
      this.engAvg = ''
    }

    if(avg1!=undefined) {
      this.impAvg= ['(Avg: ' + avg1 + ' h/y)',ch]
    } else {
      this.impAvg = []
    }
  }

  checkComm() {
    return new Promise((res,rej)=>{
      if(this.datafil){
        this.cCom=  this.datafil.length
        res('ok')
      } else {
        this.cCom=0
        res('ok')
      }
    })
  }

  addCD(a:any){
    if(this.auth.acc('SURights')){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(ComdatedialogComponent, {
        data: {sn: this.valore}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.auth.acc('SURights')) {
          let r1 = moment(result).format('YYYYMMDD')
          let r2
          if(this.data[0] !=null) r2 = this.data[0].x.replace(/\-/g,'')
          
          if(r2!=undefined && parseInt(r1)>parseInt(r2)) {
            alert('Wrong commissioning date')
          } else {
            firebase.database().ref('Hours').child(this.valore).child(r1).set({
              orem: 'c',
              perc1: 'c',
              perc2: 'c',
              perc3: 'c',
            })
            this.f(1)
          }
        }
      });
    }
  }

  open(e:any){
    if(e=="mol")  window.open('https://mol.epiroc.com/searchcriteria/search?snmin=' + this.valore, "_blank");
  }

  onResize(){
    /*this.calcolaPerc1()
    this.calcolaOrem()*/
  }

  chsjList():boolean{
    let check=0
    this.sjList.forEach(e=>{
      if(e.imiFabi!='') check=1
    })
    if(check==1) return true
    return false
  }
  
  dlData(e:any){
    const dia=this.dialog.open(GenericComponent, {data:{msg:'Retreiving data...'}})
    setTimeout(() => {
      dia.close()
    }, 20000);
    let y:any[]=[]//`Date;Serial Nr;Machine;Family;Hours;Technician`]
    let check:number=0
    let length:number=this.sjList.length
    new Promise(res=>{
      this.sjList.forEach(x=>{
        if(x.imiFabi){
          let r:string = x.imiFabi
          let as = r.slice(0,-1)
          let ws = as.split('@')
          ws.forEach(rf=>{
            let d= `${x.data11.substring(6,10)}-${x.data11.substring(3,5)}-${x.data11.substring(0,2)}`
            y.push({
              Date:new Date(d),
              sn: x.matricola,
              Machine: x.prodotto1,
              Family: rf.split(';')[0],
              Hrs:parseFloat(rf.split(';')[1]),
              Technician:x.tecnico11
            }) 
          })
        }
        check++
        if(check==length) res('')
      })
    })
    .then(()=>{
      y.sort((a:any,b:any)=>{
        if(a.Date>b.Date) return 1
        if(a.Date<b.Date) return -1
        return 0
      })
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(y);
      
      //Center columns
      let cols:string[]=['Date','sn','Hrs']

      let colWidth:any[]=[120,120,120,120,60,120]

      //columns Width
      
      let Sheets:any={}
      Sheets['Files']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['Files'] 
      }
      this.excel.exportAsExcelFile(workbook,this.valore + ' - Hours Details',cols,colWidth)
      dia.close()
    })
  }

  sortDataTable(e:any){
    this.sortT=!this.sortT
  }

  sortDataSJ(e:any){
    this.sortSJ=!this.sortSJ
  }

  updH(e:any){
    firebase.database().ref('Hours').child(e[0]).child(moment(e[1]).format('YYYYMMDD')).set({
      orem: e[2],
      perc1: e[3]>0?e[3]:'',
      perc2: e[4]>0?e[4]:'',
      perc3: e[5]>0?e[5]:'',
      editby: this.name
    })
    .then(()=>{this.f(1)})
  }

  reportHrs(){
    const dia = this.dialog.open(GenericComponent, {data:{msg:'Collecting data'}})
    setTimeout(() => {
      dia.close()
    }, 10000);
    this.elenco=[]
    //this.elenco.push('sn;model;date;eng;perc1;perc2;perc3')
    let length:number=0
    let index:number=0
    firebase.database().ref('Hours').child(this.valore).once('value',a=>{
      length = Object.values(a.val()).length
      new Promise((res,rej)=>{
        a.forEach(b=>{
          let c = b.val()
          let _date = [b.key?.slice(0,4),'-',b.key?.slice(4)].join('')
          let date = [_date.slice(0,7),'-',_date.slice(7)].join('')
          firebase.database().ref('MOL').child(this.valore).once('value',rig=>{
            this.elenco.push({
              sn:this.valore,
              Model:rig.val().model,
              Date:new Date(date),
              EngHrs:c.orem=='c'?0:parseInt(c.orem),
              Perc1:c.perc1?(c.perc1=='c'?0:parseInt(c.perc1)):0,
              Perc2:c.perc2?(c.perc2=='c'?0:parseInt(c.perc2)):0,
              Perc3:c.perc3?(c.perc3=='c'?0:parseInt(c.perc3)):0,
            })
          }).then(()=>{
            index++
            if(index==length) {res('')}
          })
        })
      }).then(()=>{
        let cols:string[]=['sn','Model','Date','EngHrs','Perc1','Perc2','Perc3']
        let colWidth:any[]=[120,120,120,60,60,60,60]
        new Promise(res=>{
          let length:number=this.elenco.length
          let check:number=0
          let a1:boolean=false
          let a2:boolean=false
          let a3:boolean=false
          this.elenco.forEach(a=>{
            if(a.Perc1!=0) a1=true
            if(a.Perc2!=0) a2=true
            if(a.Perc3!=0) a3=true
            check++
            let check1:number=0
            if(check==length) {
              this.elenco.forEach(t=>{
                if(!a1) {
                  delete t.Perc1
                  cols.splice(4,1)
                  colWidth.splice(4,1)
                }
                if(!a2) {
                  delete t.Perc2
                  cols.splice(5,1)
                  colWidth.splice(5,1)
                }
                if(!a3) {
                  delete t.Perc3
                  cols.splice(6,1)
                  colWidth.splice(6,1)
                }
                check1++
                if(check1==length) res('')
              })
            }
          })
        }).then(()=>{
          this.elenco.sort((a:any,b:any)=>{
            if(a.Date>b.Date) return 1
            if(a.Date<b.Date) return -1
            return 0
          })
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.elenco)
          let Sheets:any={}
          Sheets[this.valore]=worksheet
          const workbook: XLSX.WorkBook = { 
            Sheets, 
            SheetNames: [this.valore] 
          }
          this.excel.exportAsExcelFile(workbook,this.valore + ' - Service Job History',cols,colWidth)
          dia.close()
        })
      })
    })
  }

  reportSJ(){
    const dia = this.dialog.open(GenericComponent, {data:{msg:'Collecting data'}})
    setTimeout(() => {
      dia.close()
    }, 10000);

    this.elenco=[]
    //this.elenco.push('sn;model;date;SJ nr;Eng hrs;Perc1 hrs;Perc2 hrs;Perc3 hrs;Travel hrs;Working hrs;Days')
    firebase.database().ref('Saved').child(this.valore).once('value',b=>{
      console.log(b.val())
      b.forEach(c=>{
          let x = c.val()
          let lavoro:number=0, viaggio:number=0, ind:number=0
          for(let i=1;i<8;i++){
            let newDayTravel:number=0, newDayWork:number=0
            let vl:string 
            vl='v'
            newDayTravel= x['spo' +vl + i + '1']?x['spo' +vl + i + '1']*1:0 + x['sps' +vl + i + '1']?x['sps' +vl + i + '1']*1:0+ x['std' +vl + i + '1']?x['std' +vl + i + '1']*1:0 + x['str' +vl + i + '1']?x['str' +vl + i + '1']*1:0 + x['mnt' +vl + i + '1']?x['mnt' +vl + i + '1']*1:0 + x['mnf' +vl + i + '1']?x['mnf' +vl + i + '1']*1:0

            vl='l'
            newDayWork=x['spo' +vl + i + '1']?x['spo' +vl + i + '1']*1:0 + x['sps' +vl + i + '1']?x['sps' +vl + i + '1']*1:0+ x['std' +vl + i + '1']?x['std' +vl + i + '1']*1:0 + x['str' +vl + i + '1']?x['str' +vl + i + '1']*1:0 + x['mnt' +vl + i + '1']?x['mnt' +vl + i + '1']*1:0 + x['mnf' +vl + i + '1']?x['mnf' +vl + i + '1']*1:0
            if(newDayTravel!=0 || newDayWork!=0) ind++
            viaggio+=newDayTravel
            lavoro+=newDayWork
          }
          let dd=new Date(x.data11.substring(6,10),x.data11.substring(3,5),x.data11.substring(0,2))
          this.elenco.push({
            sn:x.matricola,
            Model:x.prodotto1,
            Date:dd,
            SJnr:x.docbpcs,
            EngHrs:x.orem1?parseInt(x.orem1.replace(/[.]/,'')):null,
            Perc1:x.perc11?parseInt(x.perc11.replace(/[.]/,'')):null,
            Perc2:x.perc21?parseInt(x.perc21.replace(/[.]/,'')):null,
            Perc3:x.perc31?parseInt(x.perc31.replace(/[.]/,'')):null,
            Travel:viaggio,
            Working:lavoro,
            Days:ind
          })
      })
    })
    .then(()=>{
      new Promise(res=>{
        console.log(this.elenco)
        let a1:boolean=false
        let a2:boolean=false
        let a3:boolean=false
        let check:number=0
        let length:number=this.elenco.length
        this.elenco.forEach(item=>{
          if(item.Perc1!=null) a1=true
          if(item.Perc2!=null) a2=true
          if(item.Perc3!=null) a3=true
          check++
          console.log(check,length)
          if(length==check) res([a1,a2,a3])
        })
      })
      .then((ris:any)=>{
        if(ris[0]==false) this.elenco.forEach(a=>{delete a.Perc1})
        if(ris[1]==false) this.elenco.forEach(a=>{delete a.Perc2})
        if(ris[2]==false) this.elenco.forEach(a=>{delete a.Perc3})
        this.elenco.sort((a:any,b:any)=>{
          if(a.Date>b.Date) return 1
          if(a.Date<b.Date) return -1
          return 0
        })
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.elenco)
        
        let cols:string[]=['sn','Model','Date','SJnr','EngHrs','Perc1','Perc2','Perc3','Travel','Working','Days']
        let colWidth:any[]=[120,120,120,120,60,60,60,60,60,60,60]
  
        let Sheets:any={}
        Sheets[this.valore]=worksheet
        const workbook: XLSX.WorkBook = { 
          Sheets, 
          SheetNames: [this.valore] 
        }
        this.excel.exportAsExcelFile(workbook,this.valore + ' - Service Job History',cols,colWidth)
        dia.close()
      })
    })
  }

  loadPartsReq(){
    this.partReqList=[]
    let i = moment(this.inizio).format('YYYY-MM-DD')
    let f = moment(this.fine).format('YYYY-MM-DD')
    firebase.database().ref('PartReqSent').child(this.valore).on('value',a=>{
      if(a.val()!=null){
        this.partReqList=[]
        setTimeout(() => {
          this.partReqList=Object.values(a.val())
        }, 1)
      }
    })  
  }

  sortDataParts(e?:any){
      this.sortParts=!this.sortParts
      this.change=1
      setTimeout(() => {
        this.change=0
      }, 1);
  }

  addSubEq(e:any){
    const step1 = this.dialog.open(NewsubeqComponent, {data: this.valore})
    step1.afterClosed().subscribe(a=>{
      if(a) {
        const step2 = this.dialog.open(SubeddialogComponent,{data:{cat:a[1],new:true, rigsn:this.valore}})
      }
    })
  }

  shipToInfo(){
    return new Promise(res=>{
      let data:any={}
      firebase.database().ref('shipTo').child(this.valore).once('value',a=>{
        if(a.val()!=null){
          data['Ship To Address']=a.val().address
          if(a.val().cont){
            Object.values(a.val().cont).forEach((b:any,i)=>{
              data['Ship To contact #' + (i*1+1)]=b.name
            })
          }
          if(a.val().cig) data.CIG=a.val().cig
          if(a.val().cup) data.CUP=a.val().cup
          
        }
      })
      .then(()=>{
        res(data)
      })      
    })
  }

  loadContract(){
    if(this.auth.acc('InternalRights')){
      firebase.database().ref('Contracts').child('active').child(this.valore).on('value',a=>{
        this.contract=[]
        if(a.val()!=null) {
          a.forEach(b=>{
            b.forEach(c=>{
              firebase.storage().ref('Contracts').child(c.val().id).listAll()
              .then(list=>{
                let items:any[]=[]
                if(list.items.length>0) items=list.items
                this.contract.push({type:c.val().type,expdate:c.val().end, info:c.val(), list:items})
              })
            })
          })
        }
      })
    }
  }

  loadWsFiles(){
    let tFiles:any[]=[]
    return new Promise((res,rej)=>{
      if(this.auth.acc('AdminRights')){
        firebase.database().ref('wsFiles').child('open').child(this.valore).once('value',a=>{
          if(a.val()!=null){
            a.forEach(b=>{
              let temp:any=b.val()
              if(b.val().days){
                let fr = Object.keys(b.val().days)
                temp.min = fr[0]
                temp.max = fr[fr.length-1]
                temp.status='Open'
              }
              this.sumHr.sum(temp)
              tFiles.push(temp)
            })
          }
        }).then(()=>{
          firebase.database().ref('wsFiles').child('archived').child(this.valore).once('value',a=>{
            if(a.val()!=null){
              let length:number = Object.keys(a.val()).length
              let check:number=0
              a.forEach(b=>{
                let temp:any=b.val()
                if(b.val().days){
                  let fr = Object.keys(b.val().days)
                  temp.min = fr[0]
                  temp.max = fr[fr.length-1]
                  temp.status='Archived'
                }
                tFiles.push(temp)
                check++
                if(check==length) {
                  res(tFiles)
                }
              })
            } else {
              if(tFiles.length>0){
                res(tFiles)
              } else {
                rej('No Files')
              }
            }
          })
        })
      } else{
        rej('Rejected')
      }
    }).then((list:any)=>{
      this.files=list
    })
    .catch(err=>{console.log(err)})
    
  }

  addP(){
    const dia = this.dialog.open(NewpartsrequestComponent, {data:{sn:this.valore}})
    dia.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.info=result
        this.info['reqId']=this.makeid.makeId(5)
        this.info['usedId']=this.userId
        this.info['new']=true
        //this.partList=[]
        this.router.navigate(['partrequest',{info:JSON.stringify(this.info),new:true}])
      }
    })
  }

  exportParts(){
    const d = this.dialog.open(GenericComponent,{data:{msg:'Retreiving data....'}})
    setTimeout(() => {
      d.close()
    }, 20000);
    let out:any[]=[]
    let length:number=this.partReqList.length
    let check:number=0
    new Promise(res=>{
      this.partReqList.forEach(req=>{
        req.Parts.forEach((part:any)=>{
          let row:output={
            Date:new Date(req.date),
            sn:req.sn,
            Model:req.model,
            Originator:req.orig,
            ShipAddress:req.shipTo && req.shipTo.address?req.shipTo.address:'',
            pn:part.pn,
            Description:part.desc,
            LLP:part.llp,
            Qty:part.qty,
            Tot:0
          }
          out.push(row)
        })
        check++
        if(check==length) res('')
      })
    })
    .then(()=>{
      out.sort((a:any,b:any)=>{
        if(a.Date>b.Date) return 1
        if(a.Date<b.Date) return -1
        return 0
      })

      let cols:string[]=[
        'Date',
        'sn',
        'Model',
        'Originator',
        'pn',
        'Qty'
      ]

      let colWidth:any[]=[120,120,120,120,250,120,250,60,60,60]
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out);
      let range=XLSX.utils.decode_range(worksheet['!ref']!)
      for(let c=0;c<=range.e.c;c++){
        let cel = worksheet[XLSX.utils.encode_cell({r:0,c:c})]
        if(cel.v=='LLP' || cel.v=='Tot'){
          for(let r=1;r<=range.e.r;r++){
            let cel1 = worksheet[XLSX.utils.encode_cell({r:r,c:c})]
            if(cel1){
              cel1.z = "#,##0.00"
            }
          }
        }
      }
      
      for(let r=1;r<=range.e.r;r++){
        let cel = worksheet[XLSX.utils.encode_cell({r:r,c:range.e.c})]
        let c2=XLSX.utils.encode_cell({r:r,c:range.e.c-1})
        let c1=XLSX.utils.encode_cell({r:r,c:range.e.c-2})
        cel.f=c1 + '*' + c2
      }
      let Sheets:any={}
      Sheets[this.valore]=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: [this.valore] 
      }
      this.excel.exportAsExcelFile(workbook,this.valore + ' - Part Request History',cols,colWidth)
      d.close()
    })
  }
}
 