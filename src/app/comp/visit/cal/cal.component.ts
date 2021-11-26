import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { DaytypeService } from '../../../serv/daytype.service'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/messaging'

@Component({
  selector: 'episjob-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss']
})
export class CalComponent implements OnInit {
  day:string=moment(new Date).format('YYYY-MM-DD')
  month:any[]=[]
  headers:string[]=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  visits:any[]=[]
  @Input() pos:string|undefined
  @Input() userId:string|undefined
  @Output() today= new EventEmitter()
  constructor(private holy:DaytypeService) { }

  ngOnInit(): void {
    this.days(new Date(this.day))
    .then(a=>this.getVisits(a))

  }

  days(d:Date){
    return new Promise((res,rej)=>{
      this.month=[]
      let g = d.getDate()
      let m = d.getMonth()
      let a = d.getFullYear()
      let i = new Date(a,m,0).getDay()+1
      for(let z=1;z<i;z++){
        this.month.push({n:'', d:'', full: '', visit:''})
      }
      for(let z=1;z<new Date(a,m+1,0).getDate()+1;z++){
        this.month.push({n:z,d:this.chDate(new Date(a,m,z)), full: new Date(a,m,z), visit:''})
      }
      for(let z=this.month.length+1;z<43;z++){
        this.month.push({n:'', d:'', full: '', visit:''})
        if(this.month.length==42) res([m+1,a])
    }
    })
  }

  chDate(a: Date){
    return this.holy.dayType(a)
  }

  mese(){
    return moment(this.day).format('MMMM YYYY')
  }

  moveMonth(a:string){
    let newYear=0
    let yearToday =new Date().getFullYear() 
    let monthToday=new Date().getMonth()+1
    let dayToday=new Date().getDate()
    let newMonth
    if(a=='+') {
      newMonth=parseInt(moment(this.day).add(1,'months').format('MM'))
      newYear=parseInt(moment(this.day).add(1,'months').format('YYYY'))
      if(monthToday==newMonth && yearToday==newYear){
        this.day=moment(new Date(newYear, newMonth-1, dayToday)).format('YYYY-MM-DD')
      } else {
        this.day=moment(new Date(newYear, newMonth-1, 1)).format('YYYY-MM-DD')
      }
    }
    if(a=='-') {
      newMonth=parseInt(moment(this.day).subtract(1,'months').format('MM'))
      newYear=parseInt(moment(this.day).subtract(1,'months').format('YYYY'))
      if(monthToday==newMonth && yearToday==newYear){
        this.day=moment(new Date(newYear, newMonth-1, dayToday)).format('YYYY-MM-DD')
      } else {
        this.day=moment(new Date(newYear, newMonth-1, 1)).format('YYYY-MM-DD')
      }
    }
    this.days(new Date(this.day)).then(a=>this.getVisits(a))
  }

  getVisits(a:any){
    this.visits=[]
    let i = moment(new Date(a[1],a[0]-1,1)).format('YYYYMMDD')
    let f= moment(new Date(a[1],a[0],0)).format('YYYYMMDD')
    firebase.database().ref('CustVisit').orderByKey().startAt(i).endAt(f).once('value',a=>{
      if(a!=null){
        a.forEach(b=>{
          let anno = b.key?.substring(0,4)
          let mese = b.key?.substring(4,6)
          let giorno = b.key?.substring(6,8)
          let nuovo = `${anno}-${mese}-${giorno}`
          let id= Object.keys(b.val()).toString().substring(0,28)
          if((this.pos=='SU' || this.pos=='adminS') || (this.pos=='sales' && id==this.userId)) {
            this.month.forEach(gt=>{
              if(moment(gt.full).format('YYYY-MM-DD')==nuovo) gt.visit='1'
            })
          }
        })
      }
    })
  }

  changeDay(a:Date){
    this.day=moment(a).format('YYYY-MM-DD')
    this.today.emit(this.day)
  }

  chDay(a:Date): boolean{
    if(moment(a).format('YYYY-MM-DD')==this.day) return true
    return false
  }
  

}

