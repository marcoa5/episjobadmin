import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobNewvisitspacer]'
})
export class NewvisitspacerDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.setProperty('width','25px')
   }

}
