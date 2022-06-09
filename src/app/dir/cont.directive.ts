import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[episjobCont]'
})
export class ContDirective {

  constructor(public el: ElementRef) {
    
  }

  ngOnInit(){
    this.el.nativeElement.style.setProperty('margin', '10px 0')
    this.el.nativeElement.style.setProperty('gap', '10px')
    this.onResize()

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
      setTimeout(() => {
        if(window.innerWidth<701){
          this.el.nativeElement.style.setProperty('padding', '50px 10px 80px 10px')
        } else {
          this.el.nativeElement.style.setProperty('padding', '50px 10px 30px 75px')
        }
      }, 1);
  }


}
