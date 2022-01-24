import { Component, OnInit, Input } from '@angular/core';
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
  @Input() fun:string|undefined
  constructor(private router: Router, private auth: AuthServiceService) {}

  ngOnInit(): void {
    this.auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('addbut',this.pos)
      }, 10);
    })
  }

  new(){
    if(this.allow) this.router.navigate([this.fun])
  }
}
