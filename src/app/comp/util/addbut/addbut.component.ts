import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
import { AuthServiceService } from 'src/app/serv/auth-service.service';



@Component({
  selector: 'episjob-addbut',
  templateUrl: './addbut.component.html',
  styleUrls: ['./addbut.component.scss']
})
export class AddbutComponent implements OnInit {
  pos:string=''
  allow:boolean=false
  allowContact:boolean=false
  @Input() exportFleet:boolean=false
  @Input() fun:string|undefined
  @Input() addNewContact:boolean=false
  @Input() addNewQuote:boolean=false
  @Input() addNewBalance:boolean=false
  @Output() exp=new EventEmitter()
  @Output() expDet=new EventEmitter()
  @Output() newCon = new EventEmitter()
  @Output() newQuote= new EventEmitter()
  @Output() newBalance=new EventEmitter()

  func:string=''
  constructor(private router: Router, private auth: AuthServiceService) {}

  ngOnInit(): void {
    if(this.addNewContact) this.func='Contact'
    if(this.addNewQuote) this.func='Quote'
    this.auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('Admin',this.pos)
        this.allowContact=this.auth.allow('All',this.pos)
      }, 10);
    })
  }

  new(){
    if(this.allow) this.router.navigate([this.fun])
  }

  export(){
    this.exp.emit()
  }

  exportDetails(){
    this.expDet.emit()
  }

  chPos(pos:string){
    return this.auth.acc(pos)
  }

  newEvent(){
    if(this.addNewContact) this.newCon.emit('new')
    if(this.addNewQuote) this.newQuote.emit('new')
    if(this.addNewBalance) this.newBalance.emit('new')

  }
}
