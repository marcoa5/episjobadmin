import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filefilter'
})
export class FilefilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      if(i.name.toLowerCase().includes(filter.toLowerCase()) ){
        return true
      }
      return false
    })
  }

  

}
