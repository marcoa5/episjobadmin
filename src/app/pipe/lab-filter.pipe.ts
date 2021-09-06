import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'labFilter'
})
export class LabFilterPipe implements PipeTransform {

  transform(items: any): any {
    return items.filter((a: any)=>{
      if(a.value==undefined || a.value==0) return false
      return true
    })
  }

}
