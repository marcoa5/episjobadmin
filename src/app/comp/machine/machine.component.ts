import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd } from '@angular/router'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment'
import 'chartjs-adapter-moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BackService } from '../../serv/back.service'

@Component({
  selector: 'episjob-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {
  disab:boolean = true
  form:any;
  formhrs:any;
  valore: any;
  model:string='';
  customer:string='';
  site:string='';
  labels: any[] = [];
  data:any[]=[];
  data1:any[]=[]
  data2:any[]=[]
  data3:any[]=[]
  hours:any[]=[]
  day:any;
  day1:any;
  arrMin:number[]=[]
  arrMax:number[]=[]
  dataRil:any
  constructor(public route: ActivatedRoute, public fb: FormBuilder, public bak: BackService) { 
    this.form = fb.group({
      serial: [''],
      model: [''],
      customer: [''],
      site: ['']
    })
    this.formhrs = this.fb.group({
      engh: [''],
      perc1h: [''],
      perc2h: [''],
      perc3h: ['']
    })
  }
  ngOnInit(): void {
    Chart.register()
    this.route.params.subscribe(r=>{
      this.valore=r.sn
      firebase.default.database().ref('MOL/' + r.sn).once('value',x=>{
        this.form = this.fb.group({
          serial: [this.valore],
          model: [x.val().model],
          customer: [x.val().customer],
          site: [x.val().site]
        })
        this.customer=x.val().customer
      })
      
      firebase.default.database().ref('Hours/' + r.sn).once('value',f=>{
        f.forEach(g=>{
          if(g.key){
            let anno = parseInt(g.key.substring(0,4)) 
            let mese = parseInt(g.key.substring(4,6))-1 
            let giorno = parseInt(g.key.substring(6,8)) 
            this.day = moment(new Date(anno,mese,giorno)).format("YYYY-MM-DD")
          }
          let h={x:this.day, y:g.val().orem}
          if(h) {
            this.data.push(h)
          }
        })
      })
      firebase.default.database().ref('Hours/' + r.sn).once('value',f=>{
        f.forEach(g=>{
          if(g.key){
            let anno = parseInt(g.key.substring(0,4)) 
            let mese = parseInt(g.key.substring(4,6))-1 
            let giorno = parseInt(g.key.substring(6,8)) 
            this.day1 = moment(new Date(anno,mese,giorno)).format("YYYY-MM-DD")
          }
          let h={x:this.day1, y:g.val().perc1|0}
          let j={x:this.day1, y:g.val().perc2|0}
          let k={x:this.day1, y:g.val().perc3|0}
          if(h) {
            this.data1.push(h)
            this.data2.push(j)
            this.data3.push(k)
          }
        })
      })
    })   
    setTimeout(() => {
      if(this.data.length!=0) {
        this.arrMin = [this.data1[0].y | 0,this.data2[0].y | 0,this.data3[0].y | 0,]
        this.arrMax=[this.data1[this.data1.length-1].y ,this.data2[this.data2.length-1].y ,this.data3[this.data3.length-1].y]
        console.log(this.arrMin ,this.arrMax)
        if(this.data.length>1) this.calcolaOrem()
        if(this.data.length>1 || this.data1.length>1 || this.data2.length>1 || this.data3.length>1)      this.calcolaPerc1()
        this.ore(this.formhrs)
        this.dataRil = moment(this.data[this.data.length-1].x).format("DD/MM/YYYY")
      }
    }, 500);
  }

  ore(a: FormGroup){
    if (this.data.length > 1) a.get('engh')?.setValue(this.data[this.data.length-1].y)    
    if (this.data1.length > 1) a.get('perc1h')?.setValue(this.data1[this.data1.length-1].y)
    if (this.data1.length > 1) a.get('perc2h')?.setValue(this.data2[this.data2.length-1].y)
    if (this.data1.length > 1) a.get('perc3h')?.setValue(this.data3[this.data3.length-1].y)
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
                y:{
                  min: (this.data[0].y | 0)-50,
                  max: (this.data[this.data.length-1].y | 0)*1+50,
                }
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
            data:this.data1,
            borderColor: col1,
            pointBackgroundColor:col1,
          },
          {
            label: "Perc2",
            data:this.data2,
            borderColor: col2,
            pointBackgroundColor:col2,
          },
          {
            label: "Perc3",
            data:this.data3,
            borderColor: col3,
            pointBackgroundColor:col3,
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
                y:{
                  min: Math.min.apply(0, this.arrMin.filter(Boolean) )-50,
                  max: Math.max.apply(0, this.arrMax.filter(Boolean))*1+50,
                }
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

}
