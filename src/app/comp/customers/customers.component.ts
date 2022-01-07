import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { BackService }  from '../../serv/back.service'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'episjob-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  filtro:any=''
  customers:any[]=[];
  _customers:any[]=[];
  pos:string='';
  ind:number=0
  custSales:string[]=[]
  rigSn:string[]=[]
  subsList:Subscription[]=[]

  constructor(public router: Router, public bak:BackService, private auth: AuthServiceService) {
    
   }

  ngOnInit() {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.ind=a.Area?.toString()
      }),
      this.auth._customers.subscribe(a=>this.customers=a)
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  open(a: String, b:string, c:string, d:string){
    this.router.navigate(['cliente',{id:d}])
  }

  
  back(){
    this.bak.backP()
  }

  filter(a:any){
    this.filtro=a
  }  

  
}
