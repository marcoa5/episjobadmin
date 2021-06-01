import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackService } from '../../serv/back.service'
import { Router } from '@angular/router'

@Component({
  selector: 'episjob-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title:string=''
  @Input() cerca:boolean=true
  @Input() home:boolean=false
  @Input() backB:any = ''
  @Output() filter = new EventEmitter()
  constructor(private router:Router) { }
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  ngOnInit(): void {
    this.largh(1)
    this.scrollaV= true
  }

  scrolla(e:Event){
    this.currentPosition = window.pageYOffset
    if(this.currentPosition>this.oldPosition){
      this.scrollaV = false
    } else {
      this.scrollaV = true
    }
    this.oldPosition = this.currentPosition
  }

  scrivi(e: any){
    this.filter.emit(e.target.value.toString())
  }

  cancella(){
    this.value=''
    this.filtro=''
    this.filter.emit('')
  }

  back(){
    if(typeof this.backB == 'string') {
      this.router.navigate([this.backB])
    }else {
      this.router.navigate(this.backB)
    }
  }

  largh(e:any){
    if(window.innerWidth>500) {
      this.lar = true
    } else {
      this.lar=false
    }      
  }

  homeNav(){
    this.router.navigate(['/'])
  }

}
