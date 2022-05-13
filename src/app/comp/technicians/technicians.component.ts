import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router, ActivatedRoute } from '@angular/router'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'episjob-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  tech:any[]=[]
  filtro:string=''
  pos:string=''
  subsList:Subscription[]=[]
  allow:boolean=false
  allSpin:boolean=true
  list:any
  constructor(private router:Router, public route: ActivatedRoute, public auth: AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('TechAdmin',this.pos)
        }, 1)
      }),
      this.auth._tech.subscribe(a=>{
        if(a) this.tech=a
      })
    )
    this.allSpin=false  
    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    this.filtro=a
  }

  tec(a:string, b:string){
    this.router.navigate(['newtech',{fn: a, sn: b}])
  }

}
