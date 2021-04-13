import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snfilter'
})
export class SnfilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter) return items
    return items.filter(i=>{
      if(i.sn.toLowerCase().includes(filter.toLowerCase()) || i.customer.toLowerCase().includes(filter.toLowerCase()) || i.model.toLowerCase().includes(filter.toLowerCase())|| i.site.toLowerCase().includes(filter.toLowerCase())){
        return true
      }
      return false
    })
  }

  

}
