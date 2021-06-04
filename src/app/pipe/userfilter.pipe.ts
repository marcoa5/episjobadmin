import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userfilter'
})
export class UserfilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      if(i.nome.toLowerCase().includes(filter.toLowerCase()) || i.cognome.toLowerCase().includes(filter.toLowerCase()) || i.pos.toLowerCase().includes(filter.toLowerCase())|| i.mail.toLowerCase().includes(filter.toLowerCase())){
        return true
      }
      return false
    })
  }

}
