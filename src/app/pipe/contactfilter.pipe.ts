import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contactfilter'
})
export class ContactfilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      if(i.name?.toLowerCase().includes(filter.toLowerCase()) || i.surname?.toLowerCase().includes(filter.toLowerCase()) || i.company?.toLowerCase().includes(filter.toLowerCase()) || i.mail?.toLowerCase().includes(filter.toLowerCase()) || i.phone?.toLowerCase().includes(filter.toLowerCase()) || i.pos?.toLowerCase().includes(filter.toLowerCase())){
        return i
      }
      return false
    })
  }

}
