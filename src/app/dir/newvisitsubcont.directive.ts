import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobNewvisitsubcont]'
})
export class NewvisitsubcontDirective {

  constructor(el:ElementRef) { 
    el.nativeElement.style.setProperty('display','flex')
  }

}
