import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobNewvisitfield]'
})
export class NewvisitfieldDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.setProperty('flex', '1 1 auto')
   }

}
