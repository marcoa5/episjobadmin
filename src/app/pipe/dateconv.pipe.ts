import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateconv'
})
export class DateconvPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value=='' || !value || value==undefined) return value
    return `${value.substring(8,10)}/${value.substring(5,7)}/${value.substring(0,4)}`
  }

}
