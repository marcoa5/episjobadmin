import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class GetquarterService {

  constructor() { }

  getQ(date?:Date){
    let r:Date=new Date()
    if(date) r = date
    let a= moment(r).format('YYYY')
    let mg= moment(r).format('MMDD')
    if(mg<'0701'){
      return a+'H1'
    } else {
      return a+'H2'
    }
  }
}
