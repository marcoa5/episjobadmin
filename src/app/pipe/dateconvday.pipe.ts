import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateconvday'
})
export class DateconvdayPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value=='' || !value || value==undefined) return value
    let n:number = new Date(value).getDay()
    let day: string=''
    switch(n){
      case 0: day= 'Sunday'
      break
      case 1: day= 'Monday'
      break
      case 2: day= 'Tuesday'
      break
      case 3: day= 'Wednesday'
      break
      case 4: day= 'Thursady'
      break
      case 5: day= 'Friday'
      break
      case 6: day= 'Saturday'
      break
    }
    return `${day}`
  }

}
