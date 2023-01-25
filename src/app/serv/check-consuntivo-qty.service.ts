import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CheckConsuntivoQtyService {

  constructor(){}
  public checkQ():ValidatorFn{
    return (fg: AbstractControl)=>{
      for(let i =0;i<21;i++){
        const llp = fg.get('_llp'+i)?.value
        const qty = fg.get('_qty'+i)?.value
        if((llp>0 && (qty<1 || qty==''))||((llp<=0 || llp=='') && qty>0)) {
          if(llp=='' || llp<=0) fg.get('_llp'+i)?.setErrors({qtyMismath:true})
          if(qty=='' || qty<=0) fg.get('_qty'+i)?.setErrors({qtyMismath:true})
          return {qtyMismath:true}
        }
      }
      return null
    }
  }
}
