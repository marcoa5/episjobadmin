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
import { CopyComponent } from '../../util/dialog/copy/copy.component'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';


export interface hrsLabel {
  lab: string
  value: any
  click: any
  url: any
}

@Component({
  selector: 'episjob-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {
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
  hrsLabels: hrsLabel[]=[]
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
  sortParts:boolean=true
  name:string=''
  elenco:any[]=[]
  access:any[]=[]
  area:string=''
  partReqList:any[]=[]
  subsList:Subscription[]=[]
  
  constructor(private auth: AuthServiceService, private dialog: MatDialog, public route: ActivatedRoute, public bak: BackService, public router:Router, private clipboard: Clipboard) { }

  ngOnInit(): void {
    Chart.register()
    this.subsList.push(this.auth._userData.subscribe((a: { Pos: string; Nome: string; Cognome: string; Area: string; })=>{
      this.pos=a.Pos
      this.name = a.Nome + ' ' + a.Cognome
      this.area=a.Area
    }))
    this.route.params.subscribe(r=>{
      this.valore=r.sn
      if(this.pos=='customer' || this.pos=='sales'){
        firebase.database().ref('RigAuth').child(this.valore).child('a'+this.area).once('value',r=>{
          console.log(r.val())
          if(r.val()=='1') {
            this.allow=this.auth.allow('machine',this.pos)
          } else {this.allow=false}
        })
      } else {
        this.allow=this.auth.allow('machine',this.pos)
      }
    })
    setTimeout(() => {
      this.loadPartsReq()
    }, 1);
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
      this.loadData()
      .then(()=>{
        if(this.data[0]) this.inizio=this.data[0].x
        this.rigLabels=[
          {value:this.valore, lab:'Serial Nr.',click:'',url:''},
          {value:this.customer, lab:'Customer',click: (this.pos!='sales')? this.id:'',url: this.pos!='sales'?'cliente':''},
        ]
        if(this.site!='') this.rigLabels.push({value:this.site, lab:'Site',click:'',url:''})
        if(this.in) this.rigLabels.splice(1,0,{value: this.in, lab:'Part Nr.',click:'', url:''})
        
        if(this.data[0] && this.data[0].y=='c' && this.data[0]!=undefined) {
          this.rigLabels.push({value:moment(this.data[0].x).format("DD/MM/YYYY"), lab:'Commissioning Date',click:'',url:''})
          this.showAdd=false
        }
      if(this.data[0] && this.data[0].y!='c' && this.data[0]!=undefined) {
        this.showAdd=true
      }
        //if(a==0) this.filter(new Date(moment(new Date()).subtract(3,'months').format('YYYY-MM-DD')),new Date())
        if(a==1) this.filter(this.inizio,this.fine)
        this.checkComm()
        this.lastRead()
      })
    }) 
  }

  lastRead(){
    if(this.cCom>0 && this.datafil[0].y!='c') {
      this.hrsLabels.push({
        value:moment(this.data[this.data.length-1].x).format('DD/MM/YYYY'),
        lab: 'Last Read',
        click:'',
        url:''
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
          {value:this.engAvg!=''?`${this.th(this.data[this.data.length-1].y)} ${this.engAvg}`:this.th(this.data[this.data.length-1].y),lab: 'Engine Hrs',click:'',url:''},
          {value:this.impAvg!=[] && (this.impAvg[1]==1||this.impAvg[1]==2||this.impAvg[1]==3)?`${this.th(this.data[this.data.length-1].y1)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y1),lab: 'Percussion 1',click:'',url:''},
          {value:this.impAvg!=[] && (this.impAvg[1]==3||this.impAvg[1]==2)?`${this.th(this.data[this.data.length-1].y2)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y2),lab: 'Percussion 2',click:'',url:''},
          {value:this.impAvg!=[] && this.impAvg[1]==3?`${this.th(this.data[this.data.length-1].y3)} ${this.impAvg[0]}`:this.th(this.data[this.data.length-1].y3),lab: 'Percussion 3',click:'',url:''}
        ]  
      }
    }
    
    firebase.database().ref('Saved').child(this.valore).once('value',h=>{
      let iniz = moment(i).format('YYYYMMDD')
      let fine = moment(f).format('YYYYMMDD')
      if(fine<iniz) fine=(parseInt(iniz)+1).toString()
      this.sjList=[]
      h.forEach(g=>{
        if(g.key && g.key.substring(0,8)>=iniz && g.key.substring(0,8)<=fine){
          this.sjList.push(g.val())
        }        
      })
    })
  }

  res(e:any){
    /*this.calcolaOrem()
    this.calcolaPerc1()*/
  }

  de(a:string){
    if(this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(DeldialogComponent, {
        data: {name: a.replace(/\-/g,'')}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.pos=='SU') {
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
      if(this.pos=='SU'){
        const dialogconf = new MatDialogConfig();
        dialogconf.disableClose=false;
        dialogconf.autoFocus=false;
        const dialogRef = this.dialog.open(InputhrsComponent, {
          data: {hr: a!=undefined? a : 0}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result!=undefined && this.pos=='SU') {
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
            backgroundColor: 'rgb(255,205,0)',
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
    .then(()=>{
      this.lastRead()
    })
  }

  avgHrs(){
    this.dataAvg= this.datafil
    let avg, avg1, num, num1, den, ch
    if(this.data[0]!=undefined && this.dataAvg[this.dataAvg.length-1]!=undefined && this.dataAvg.length>1) {
      num = (this.dataAvg[this.dataAvg.length-1].y-this.dataAvg[0].y)
      den=moment(new Date(this.dataAvg[this.dataAvg.length-1].x)).diff(moment(new Date(this.dataAvg[0].x)))/1000/60/60/24
      avg=num==0?0:this.th((Math.round(num/den*365)))
      if(this.dataAvg[1].y3>=0) {
        ch=3
        let n  =this.dataAvg.length-1
        num1 = (this.dataAvg[n].y1*1+this.dataAvg[n].y2*1+this.dataAvg[n].y3*1-this.dataAvg[0].y1*1-this.dataAvg[0].y2*1-this.dataAvg[0].y3*1)/3
        avg1=this.th((Math.round(num1/den*365)))
      }else if(this.dataAvg[1].y2>=0) {
        ch=2
        let n  =this.dataAvg.length-1
        num1 = (this.dataAvg[n].y1*1+this.dataAvg[n].y2*1-this.dataAvg[0].y1*1-this.dataAvg[0].y2*1)/2
        avg1=this.th((Math.round(num1/den*365)))
      } else if(this.dataAvg[1].y1>=0) {
        ch=1
        let n =this.dataAvg.length-1
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
    if(this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(ComdatedialogComponent, {
        data: {sn: this.valore}
      });

      dialogRef.afterClosed().subscribe(result => {
        let fd = result.split('/')
        if(result!=undefined && this.pos=='SU') {
          let r1 = moment(new Date(fd[2],fd[1]-1,fd[0])).format('YYYYMMDD')
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
    if(e=="mol")  window.open('https://mol.epiroc.com/search-criteria/search?snmin=' + this.valore, "_blank");
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
    let y:any[]=[`Date;Serial Nr;Machine;Family;Hours;Technician`]
    this.sjList.map(x=>{
      if(x.imiFabi){
        let r:string = x.imiFabi
        let as = r.slice(0,-1)
        let ws = as.split('@')
        ws.forEach(rf=>{
          let d= `${x.data11.substring(6,10)}-${x.data11.substring(3,5)}-${x.data11.substring(0,2)}`
          y.push(`${d};${x.matricola};${x.prodotto1};${rf.split(';')[0]};${rf.split(';')[1]};${x.tecnico11}`)
        })
      }
    })
    this.clipboard.copy(y.toString().replace(/,/g,'\n').replace(/;/g,'\t'))
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(CopyComponent, {
      data: {}
    });
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
    this.elenco=[]
    this.elenco.push('sn;model;date;eng;perc1;perc2;perc3')
    firebase.database().ref('Hours').child(this.valore).once('value',a=>{
      a.forEach(b=>{
        let c = b.val()
        let _date = [b.key?.slice(0,4),'-',b.key?.slice(4)].join('')
        let date = [_date.slice(0,7),'-',_date.slice(7)].join('')
        firebase.database().ref('MOL').child(this.valore).once('value',rig=>{
          this.elenco.push(`${this.valore};${rig.val().model};${date};${c.orem=='c'?0:c.orem};${c.perc1?(c.perc1=='c'?0:c.perc1):0};${c.perc2?(c.perc2=='c'?0:c.perc2):0};${c.perc3?(c.perc3=='c'?0:c.perc3):0}`)
        })
      })
    })
    .then(()=>{
      setTimeout(() => {
        this.clipboard.copy(this.elenco.toString().replace(/,/g,'\n').replace(/;/g,'\t'))
        const dialogconf = new MatDialogConfig;
        dialogconf.disableClose=false;
        dialogconf.autoFocus=false;
        const dialogRef = this.dialog.open(CopyComponent, {
          data: {}
        });
      }, 1000);
    })
  }

  loadPartsReq(){
    this.partReqList=[]
    let i = moment(this.inizio).format('YYYY-MM-DD')
    let f = moment(this.fine).format('YYYY-MM-DD')
    firebase.database().ref('PartReqSent').child(this.valore).once('value',a=>{
      a.forEach(b=>{
        if(!this.partReqList.includes(b.val()) && b.val().date<=f && b.val().date>=i) this.partReqList.push(b.val())
      })
    })  
  }

  sortDataParts(e?:any){
      this.sortParts=!this.sortParts
  }
}
 