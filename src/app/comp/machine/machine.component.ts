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
  limit:number=5;
  dataSource = this.data
  displayedColumns: string[] = ['Date', 'Engine', 'Perc1', 'Perc2', 'Perc3'];
  constructor(public route: ActivatedRoute, public bak: BackService, public router:Router) { 
  
  }
  ngOnInit(): void {
    Chart.register()
    this.route.params.subscribe(r=>{
      this.valore=r.sn
      firebase.default.database().ref('MOL/' + r.sn).once('value',x=>{
        this.site = x.val().site
        this.model=x.val().model
        this.customer=x.val().customer
      })
      
      this.loadData(this.valore)
      
    })   
    setTimeout(() => {
      if(this.data.length!=0) {
        this.data.map(a=>{
          if (parseInt(a.y1)==0) a.y1=undefined
          if (parseInt(a.y2)==0) a.y2=undefined
          if (parseInt(a.y3)==0) a.y3=undefined
          return {x: a.x, y: a.y, y1:a.y1,y2:a.y2,y3:a.y3}
        })
        if(this.data.length>1) this.calcolaOrem()
        if(this.data.length>1) this.calcolaPerc1()
        this.ore()
        this.dataRil = moment(this.data[this.data.length-1].x).format("DD/MM/YYYY")
      }
    }, 500);
  }

  loadData(r:any){
    firebase.default.database().ref('Hours/' + r).limitToLast(this.limit).once('value',f=>{
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
    if (this.data.length > 1) {
      this.Engh=this.data[this.data.length-1].y 
      this.Perc1=this.data[this.data.length-1].y1
      this.Perc2=this.data[this.data.length-1].y2
      this.Perc3=this.data[this.data.length-1].y3
    }
  }

  calcolaOrem(){
    var canvas = <HTMLCanvasElement> document.getElementById('orem')
    var ctx = canvas.getContext('2d')
    if(ctx){
      var g = new Chart(ctx, {
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
    var canvas = <HTMLCanvasElement> document.getElementById('perc1')
    var ctx = canvas.getContext('2d')
    let col1:string='rgb(112,173,71)'
    let col2:string='rgb(91,155,213)'
    let col3:string='rgb(237,125,49)'
    if(ctx){
      var g = new Chart(ctx, {
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
    this.router.navigate(['cliente',{cust:a}])
  }

}
 