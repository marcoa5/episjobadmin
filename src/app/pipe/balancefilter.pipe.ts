import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balancefilter'
})
export class BalancefilterPipe implements PipeTransform {

  transform(items: any[], filter: string) {
    if(!items || !filter || filter=='') return items
    return items.filter(i=>{
      if(i.a170customer1.toLowerCase().includes(filter.toLowerCase()) ||i.a230rig.toLowerCase().includes(filter.toLowerCase()) || i.a120docBPCS.toLowerCase().includes(filter.toLowerCase())){
        return i
      }
      return false
    })
  }


}
