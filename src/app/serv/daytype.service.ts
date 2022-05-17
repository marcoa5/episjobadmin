import { Injectable } from '@angular/core';
import * as moment from 'moment'
@Injectable({
  providedIn: 'root'
})
export class DaytypeService {

  constructor() { }

  dayType(day: Date): any{
    let y = parseInt(moment(day).format('YYYY'))
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
    if(holy.includes(moment(day).format('YYYY-MM-DD'))) return false
  
    if(day.getDay()==0 || day.getDay()==6) return false
    return true
    
  }
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
