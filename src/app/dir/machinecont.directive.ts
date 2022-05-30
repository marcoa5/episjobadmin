import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[episjobMachinecont]'
})
export class MachinecontDirective {

  constructor(private el: ElementRef) { }

  ngOnInit(){
    this.el.nativeElement.style.setProperty('color', '$dark-text')
    this.el.nativeElement.style.setProperty('overflow', 'hidden')
    this.el.nativeElement.style.setProperty('width', '100%')

  }

}
