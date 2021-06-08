import { APP_INITIALIZER, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment'
import 'chartjs-adapter-moment';
import { BackService } from '../../serv/back.service'
import { MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { InputhrsComponent } from '../dialog/inputhrs/inputhrs.component'
import { DeldialogComponent } from '../dialog/deldialog/deldialog.component'
import { FormGroup, FormControl } from '@angular/forms'

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
  range = new FormGroup({
    start: new FormControl(new Date(moment(new Date()).days(-90).format('YYYY, MM, DD'))),
    end: new FormControl(new Date())
  });
  disab:boolean = true
  valore: any='';
  model:string='';
  customer:string='';
  site:string='';
  in:string='';
  docBpcs:string='';
  dataDoc:string=''
  labels: any[] = [];
  data:any[]=[]
  data1:any[]=[]
  hours:any[]=[]
  day:any;
  day1:any;
  dataRil:any
  Engh:number=0
  Perc1:number=0
  Perc2:number=0
  Perc3:number=0
  limit:any=0
  dataSource = this.data
  g1:Chart | null | undefined
  g2:Chart | null | undefined
  displayedColumns: string[] = ['Date', 'Engine', 'Perc1', 'Perc2', 'Perc3'];
  rigLabels: hrsLabel[]=[]
  hrsLabels: hrsLabel[]=[]
  pos:string=''
  iniz:any=''
  ri:boolean=true
  constructor(private dialog: MatDialog, public route: ActivatedRoute, public bak: BackService, public router:Router) { 
  
  }
  ngOnInit(): void {
    this.limit='5'
    Chart.register()
    this.route.params.subscribe(r=>{
      this.valore=r.sn
    })
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos= b.val().Pos
        this.iniz=b.val().Area
      }).then(()=>{
        if(this.pos=='sales'){
          firebase.database().ref('RigAuth/' + this.valore).child('a' + this.iniz).once('value',a=>{
            
            if(a.val()==1) {
              this.ri = true
              this.f()
            }
            if(a.val()==0) this.ri = false
          })
        } else {
          this.f()
        }
      })  
       
    })
  }

  f(){
    firebase.database().ref('MOL/' + this.valore).on('value',x=>{
      this.site = x.val().site
      this.model=x.val().model
      this.customer=x.val().customer
      this.docBpcs=x.val().docbpcs
      this.in = x.val().in
      this.rigLabels=[
        {value:this.valore, lab:'Serial Nr.',click:'',url:''},
        {value:this.model, lab:'Model',click:'',url:''},
        {value:this.customer, lab:'Customer',click:this.customer,url:'cliente'},
        {value:this.site, lab:'Site',click:'',url:''}
      ]
      for(let i = 7; i>0;i--){
        if(x.val()['dat' + i + 1]!='') this.dataDoc=x.val()['dat' + i + 3] + x.val()['dat' + i + 2] + x.val()['dat' + i + 1]
      }

    })      
    this.avv()
  }

  avv(){
    this.loadData(this.valore)
    setTimeout(() => {
      this.loadCharts()
      this.hrsLabels=[
        {value:this.th(this.Engh),lab: 'Engine Hrs',click:'',url:''},
        {value:this.th(this.Perc1),lab: 'Percussion 1',click:'',url:''},
        {value:this.th(this.Perc2),lab: 'Percussion 2',click:'',url:''},
        {value:this.th(this.Perc3),lab: 'Percussion 3',click:'',url:''}
      ]
    }, 850);
    this.dataSource=this.data
  }

  th(a:any){
    if(a){
      a=a.toString()
    let b = a.toString().length
    if(b<4) return a
    if(b>3 && b<7) return `${a.substring(0,b-3)}.${a.substring(b-3,b)}`
    if(b>6 && b<10) return `${a.substring(0,b-6)}.${a.substring(b-6,b-3)}.${a.substring(b-3,b)}`
    }
  }

  loadCharts(){
    if(this.data.length>0) {
      this.data.map(a=>{
        if (parseInt(a.y1)==0) a.y1=undefined
        if (parseInt(a.y2)==0) a.y2=undefined
        if (parseInt(a.y3)==0) a.y3=undefined
        return {x: a.x, y: a.y, y1:a.y1,y2:a.y2,y3:a.y3}
      })
      if(this.data.length>0) this.calcolaOrem()
      if(this.data.length>0) this.calcolaPerc1()
      this.ore()
      this.dataRil = moment(this.data[this.data.length-1].x).format("DD/MM/YYYY")
    }
  }

  loadData(r:any){
    this.data=[]
    firebase.database().ref('Hours/' + r).on('value',f=>{
      f.forEach(g=>{
        let iniz = moment(this.range.value.start).format('YYYYMMDD')
        let fine = moment(this.range.value.end).format('YYYYMMDD')
        var h:any
        if(g.key && g.key>=iniz && g.key <= fine){
          let anno = parseInt(g.key.substring(0,4)) 
          let mese = parseInt(g.key.substring(4,6))-1 
          let giorno = parseInt(g.key.substring(6,8)) 
          this.day = moment(new Date(anno,mese,giorno)).format("YYYY-MM-DD")
          h={x:this.day, y:g.val().orem, y1:g.val().perc1, y2:g.val().perc2, y3:g.val().perc3}
        }
        if(h!=undefined) {
          this.data.push(h)
        }
      })
    })
  }

  ore(){
    if (this.data.length > 0) {
      this.Engh=this.data[this.data.length-1].y 
      this.Perc1=this.data[this.data.length-1].y1
      this.Perc2=this.data[this.data.length-1].y2
      this.Perc3=this.data[this.data.length-1].y3
    }
  }

  calcolaOrem(){
    if (this.g1) this.g1.destroy()
    var canvas = <HTMLCanvasElement> document.getElementById('orem')
    var ctx = canvas.getContext('2d')
    if(ctx){
      this.g1 = new Chart(ctx, {
        type: 'line',
        data: {
          datasets:[{
            label: "Engine Hours",
            data:this.data,
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
    var ctx = canvas.getContext('2d')
    let col1:string='rgb(112,173,71)'
    let col2:string='rgb(91,155,213)'
    let col3:string='rgb(237,125,49)'
    if(ctx){
      this.g2 = new Chart(ctx, {
        type: 'line',
        data: {
          datasets:[{
            label: "Perc1",
            data: this.data,
            parsing: {
              yAxisKey: 'y1'
            },
            borderColor: col1,
            pointBackgroundColor:col1,
          },
          {
            label: "Perc2",
            data:this.data,
            parsing: {
              yAxisKey: 'y2'
            },
            
            borderColor: col2,
            pointBackgroundColor:col1,
          },
          {
            label: "Perc3",
            data:this.data,
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

  back(){
    this.bak.backP()
  }

  open(a:string){
    this.router.navigate(['cliente',{cust1:a}])
  }

  rigInfo(){
    return `Rig info - ${this.valore} ${this.in!=''? '(' + this.in  + ')' : ''}`
  }
  
  dataRile(){
    return `Running hours ${this.dataRil? '@ ' + this.dataRil : ''}`
  }

  contr(){
    return false
  }

  go(e:any){
    this.router.navigate(['newrig',{name:this.valore}])
  }

  res(e:any){
    this.calcolaOrem()
    this.calcolaPerc1()
  }

  up(a:string,b:any, c:string){
    if(this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(InputhrsComponent, {
        data: {hr: a!=undefined? a : 0}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.pos=='SU') {
          //alert(`Hours/${this.valore}/${b.replace(/\-/g,'')}`)
          firebase.database().ref(`Hours/${this.valore}/${b.replace(/\-/g,'')}`).child(c).set(result)
          this.avv()
        }
      });
    }
  }

  de(a:string){
    const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(DeldialogComponent, {
        data: {name: a.replace(/\-/g,'')}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.pos=='SU') {
          firebase.database().ref(`Hours/${this.valore}/`).child(a.replace(/\-/g,'')).remove()
          avv()
        }
      });
    }
  
}
 