import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd } from '@angular/router'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as moment from 'moment'
import 'chartjs-adapter-moment';

@Component({
  selector: 'episjob-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})
export class MachineComponent implements OnInit {
  valore: any;
  myChart:any;
  labels: any[] = [];
  data:any[]=[];
  hours:any[]=[]
  day:any;
  constructor(public route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(r=>{
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
    })   
    setTimeout(() => {
      console.log(this.data.length, this.data)
      this.calcola()
    }, 250);
  }

  calcola(){
    var canvas = <HTMLCanvasElement> document.getElementById('myChart')
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
                  min: (this.data[0].y)-50,
                  max: (this.data[this.data.length-1].y)*1+50,
                }
            },
            maintainAspectRatio: false,
        }
    });
    }
    
  }

}
