import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disbutton'
})
export class DisbuttonPipe implements PipeTransform {

  transform(items:any[], filter:string): any {
    return  items.filter(a=>{
        if(a.auth.includes(filter)) return true
        return false
      });
  }

}
