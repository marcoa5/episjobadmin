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
  @Input() exportFleet:boolean=false
  @Input() fun:string|undefined
  @Output() exp=new EventEmitter()
  @Output() expDet=new EventEmitter()
  constructor(private router: Router, private auth: AuthServiceService) {}

  ngOnInit(): void {
    this.auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('Admin',this.pos)
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
}
