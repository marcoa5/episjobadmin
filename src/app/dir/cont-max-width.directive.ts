import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobContMaxWidth]'
})
export class ContMaxWidthDirective {

  constructor(el:ElementRef) { 
    el.nativeElement.style.setProperty('max-width', '1000px')
  }

}
