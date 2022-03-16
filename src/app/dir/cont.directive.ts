import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[episjobCont]'
})
export class ContDirective {

  constructor(public el: ElementRef) {
    
  }

  ngOnInit(){
    this.onResize()
    this.el.nativeElement.style.setProperty('margin', '10px 0')
    this.el.nativeElement.style.setProperty('gap', '10px')
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<701){
      this.el.nativeElement.style.setProperty('padding', '80px 10px 70px 10px')
    } else {
      this.el.nativeElement.style.setProperty('padding', '80px 10px 30px 60px')
    }
  }


}
