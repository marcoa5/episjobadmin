import { Directive, ElementRef,  } from '@angular/core';

@Directive({
  selector: '[episjobTablecont]'
})
export class TablecontDirective {

  constructor(public el: ElementRef) { }

  ngOnInit(){
    this.el.nativeElement.style.setProperty('height', '296px')
    this.el.nativeElement.style.setProperty('max-height', '296px')
    this.el.nativeElement.style.setProperty('overflow-y', 'auto')
  }

  

}
