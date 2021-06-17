import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custfilter'
})
export class CustfilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      console.log(i.c1)
      if(i.c1.toLowerCase().includes(filter.toLowerCase())){
        return i.c1
      }
      return false
    })
  }


}
