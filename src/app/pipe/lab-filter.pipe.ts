import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labFilter'
})
export class LabFilterPipe implements PipeTransform {

  transform(items: any[]): any {
    if(!items) return items
    return items.filter(a=>{
      if(a.value!=undefined && a.value!=0) return true
      return false
    })
  }

}
