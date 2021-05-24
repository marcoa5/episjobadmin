import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment'
import 'chartjs-adapter-moment';
import { BackService } from '../../serv/back.service'

@Component({
  selector: 'episjob-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {
  disab:boolean = true
  valore: any;
  model:string='';
  customer:string='';
  site:string='';
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
  constructor(public route: ActivatedRoute, public bak: BackService, public router:Router) { 
  
  }
  ngOnInit(): void {
    this.limit='5'
    Chart.register()
    this.route.params.subscribe(r=>{
      this.valore=r.sn
      firebase.default.database().ref('MOL/' + r.sn).once('value',x=>{
        this.site = x.val().site
        this.model=x.val().model
        this.customer=x.val().customer
      })      
    })   
    this.avv(5)
    
  }

  avv(lim:number){
    this.loadData(this.valore,lim)
    setTimeout(() => {
      this.loadCharts()
    }, 850);
    this.dataSource=this.data
  }

  loadCharts(){
    console.log(this.data)
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

  loadData(r:any, lim:number){
    this.data=[]
    firebase.default.database().ref('Hours/' + r).limitToLast(lim).once('value',f=>{
      f.forEach(g=>{
        if(g.key){
          let anno = parseInt(g.key.substring(0,4)) 
          let mese = parseInt(g.key.substring(4,6))-1 
          let giorno = parseInt(g.key.substring(6,8)) 
          this.day = moment(new Date(anno,mese,giorno)).format("YYYY-MM-DD")
        }
        let h={x:this.day, y:g.val().orem, y1:g.val().perc1, y2:g.val().perc2, y3:g.val().perc3}
        if(h) {
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

}
 