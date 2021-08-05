import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobNewvisitico]'
})
export class NewvisiticoDirective {

  constructor(el:ElementRef) {
    el.nativeElement.style.setProperty('font-size','35px')
    el.nativeElement.style.setProperty('padding-top','10px')
    el.nativeElement.style.setProperty('width','35px')
   }

}
