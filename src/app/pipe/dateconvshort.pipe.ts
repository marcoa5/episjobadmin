import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateconvshort'
})
export class DateconvshortPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value=='' || !value || value==undefined) return value
    return `${value.substring(8,10)}/${value.substring(5,7)}/${value.substring(2,4)}`
  }

}
