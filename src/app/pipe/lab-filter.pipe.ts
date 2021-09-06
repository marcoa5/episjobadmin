import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labFilter'
})
export class LabFilterPipe implements PipeTransform {

  transform(items: any): any {
    return items.filter((a: any)=>{
      if(a.value==undefined) return false
      return true
    })
  }

}
