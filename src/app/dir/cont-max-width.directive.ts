import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[episjobContMaxWidth]'
})
export class ContMaxWidthDirective {
  @Input() episjobContMaxWidth:any=1000
  constructor(private el:ElementRef) { 
    
  }

  ngOnInit(){
    this.el.nativeElement.style.setProperty('max-width', this.episjobContMaxWidth + 'px')
  }

}
