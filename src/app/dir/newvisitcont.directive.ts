import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobNewvisitcont]'
})
export class NewvisitcontDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.setProperty('display', 'grid')
    el.nativeElement.style.setProperty('margin', '10px 0')
    el.nativeElement.style.setProperty('gap', '10px')

  }

}
