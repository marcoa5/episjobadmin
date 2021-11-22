import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DaytypeService } from '../../serv/daytype.service'

@Component({
  selector: 'episjob-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss']
})
export class CalComponent implements OnInit {
  day:string=moment(new Date).format('YYYY-MM-DD')
  month:any[]=[]
  constructor(private holy:DaytypeService) { }

  ngOnInit(): void {
    this.days(new Date(this.day))

  }

  days(d:Date){
    this.month=[]
    let g = d.getDate()
    let m = d.getMonth()
    let a = d.getFullYear()
    let i = new Date(a,m,0).getDay()+1
    for(let z=1;z<i;z++){
      this.month.push({n:'', d:''})
    }
    for(let z=1;z<new Date(a,m+1,0).getDate()+1;z++){
      this.month.push({n:z,d:this.chDate(new Date(a,m,z))})
    }
  }

  chDate(a: Date){
    return this.holy.dayType(a)
  }

  mese(){
    return moment(this.day).format('MMMM YYYY')
  }

  moveMonth(a:string){
    if(a=='+') this.day=moment(this.day).add(1,'months').format('YYYY-MM-DD')
    if(a=='-') this.day=moment(this.day).add(-1,'months').format('YYYY-MM-DD')
    this.days(new Date(this.day))
  }

  

}

