import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tablefilter'
})
export class TablefilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
        if(i.sn.toLowerCase().includes(filter.toLowerCase()) ||
        i.model.toLowerCase().includes(filter.toLowerCase()) ||
        i.customer.toLowerCase().includes(filter.toLowerCase())
        ) return i
      return false
    })
  }

}
