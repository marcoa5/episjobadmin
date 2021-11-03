import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as moment from 'moment'
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
@Component({
  selector: 'episjob-visitlist',
  templateUrl: './visitlist.component.html',
  styleUrls: ['./visitlist.component.scss']
})
export class VisitlistComponent implements OnInit {
  pos:string=''
  userId:String=''
  visits: any=[]
  month:string=''
  days:any[]=[]
  _days:any[]=[]
  dailyList:any[]=[]
  m:any = {m: new Date().getMonth()+1,y: new Date().getFullYear(), ext:moment(new Date()).format('MMMM YYYY')}
  constructor() { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
          this.userId=a.uid
        })
        .then(()=>{
          firebase.database().ref('CustVisit').once('value',a=>{
            a.forEach(b=>{
              b.forEach(c=>{
                if(this.userId==c.key?.substring(0,28)){
                  c.forEach(d=>{
                    this.visits.push(d.val())
                  })
                }
              })
            })
          }).then(()=>{
            this.giorni(this.m.m,this.m.y).then((a:any)=>this.days=a)
          })
        })
      }
    })
  }

  giorni(m:number, y:number){
    this._days=[]
    this.dailyList=[]
    let i =new Date(y,m-1,1)
    let f= new Date(y,m,0)
    let ch = i.getDay()-1
    let ch1 = new Date(y,m,0).getDate()
    return new Promise((res,rej)=>{
      let vList: { [x: string]: { date: any; c1: string; }; }
      for(let r=1; r<(i.getDay()==0?7:i.getDay());r++) this._days.push({n:'',day:'',visits:'' })
      for(let o = 1; o<new Date(y,m,0).getDate()+1;o++){
      this._days.push({n:o,day: new Date(y,m-1,o),visits:'', holy:dayType(new Date(y,m-1,o))})
        let count=1
        this.visits.forEach((el: { date: any; c1:string }) => {
          if(moment(new Date(y,m-1,o)).format('YYYY-MM-DD')==el.date){
            this._days[o-1].visits=count
            count++
          }
        })
        if(this._days.length == ch+ch1) {
          console.log(this._days)
          res(this._days)
        }
      }
    })  
  }

  gio(d:any){
    this.dailyList=[]
    if(d.day!=undefined) {
      this.visits.forEach((el: { date: string; }) => {
        if(el.date==moment(d.day).format('YYYY-MM-DD')) this.dailyList.push(el)
      });
    }
  }

  moveMonth(a:string){
    let data = new Date(this.m.y,this.m.m-1,1)
    if(a=='+') {
      this.m.m = moment(new Date(data)).add(1,'months').format('MM')
      this.m.y=moment(new Date(data)).add(1,'months').format('YYYY')
      this.m.ext = moment(new Date(data)).add(1,'months').format('MMMM YYYY')
    }
    if(a=='-') {
      this.m.m = moment(new Date(data)).add(-1,'months').format('MM')
      this.m.y=moment(new Date(data)).add(-1,'months').format('YYYY')
      this.m.ext = moment(new Date(data)).add(-1,'months').format('MMMM YYYY')
    }
    this.giorni(this.m.m,this.m.y)    
    .then((a:any)=>{
      this.days=a
    })
  }

  aa():boolean{
    const box = document.querySelector('.calCont')
    if(box && box.clientWidth<400) return true
    return false
  }
}

function dayType(a: any): any{
  let y = parseInt(moment(a).format('YYYY'))
  let holy: string[]=[
    moment(new Date(y, 0,1)).format('YYYY-MM-DD'),
    moment(new Date(y,0,6)).format('YYYY-MM-DD'),
    moment(new Date(y,3,25)).format('YYYY-MM-DD'),
    moment(new Date(y,4,1)).format('YYYY-MM-DD'),
    moment(new Date(y,5,2)).format('YYYY-MM-DD'),
    moment(new Date(y,7,15)).format('YYYY-MM-DD'),
    moment(new Date(y,10,1)).format('YYYY-MM-DD'),
    moment(new Date(y,11,8)).format('YYYY-MM-DD'),
    moment(new Date(y,11,24)).format('YYYY-MM-DD'),
    moment(new Date(y,11,25)).format('YYYY-MM-DD'),
    moment(new Date(y,11,26)).format('YYYY-MM-DD'),
    moment(new Date(y,11,31)).format('YYYY-MM-DD'),
  ]
  holy.push(moment(Easter(y)).format('YYYY-MM-DD'))
  holy.push(moment(new Date(moment(Easter(y)).add(1,'days').format('YYYY-MM-DD'))).format('YYYY-MM-DD'))
  if(holy.includes(moment(a).format('YYYY-MM-DD'))) return false

  if(a.getDay()==0) return false
  return true
  
}

function Easter(Y:number):Date {
  var C = Math.floor(Y/100);
  var N = Y - 19*Math.floor(Y/19);
  var K = Math.floor((C - 17)/25);
  var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
  I = I - 30*Math.floor((I/30));
  I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
  var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
  J = J - 7*Math.floor(J/7);
  var L = I - J;
  var M = 3 + Math.floor((L + 40)/44);
  var D = L + 28 - 31*Math.floor(M/4);
  return new Date(Y,M-1,D)
}