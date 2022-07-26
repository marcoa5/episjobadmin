import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filefilter'
})
export class FilefilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      return i.name.toLowerCase().includes(filter.toLowerCase())
      /*if(i.name.toLowerCase().includes(filter.toLowerCase()) ){
        if(filter.length>=5) console.log(i.name)
        return true
      }
      return false*/
    })
  }

  

}
