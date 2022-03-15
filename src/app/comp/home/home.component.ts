import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';


@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pos:string=''
  nome:string=''
  spin:boolean=true
  buttons:any = [
    {
      id:'Equipment',
      icon:'precision_manufacturing', 
      route:'rigs', 
      auth:['SU','admin','adminS','tech','sales','customer']
    },
    {
      id:'Companies',
      icon:'work', 
      route:'customers', 
      auth:['SU','admin','adminS','tech','sales','customer']
    },
    {
      id:'ServiceJob',
      icon:'text_snippet', 
      route:'sj', 
      auth:['SU','admin','adminS','tech']
    },
    {
      id:'Contacts',
      icon:'account_box', 
      route:'contacts', 
      dis:false, 
      auth:['SU','admin','adminS','sales']
    },
    {
      id:'Technicians',
      icon:'handyman', 
      route:'technicians', 
      dis:false, 
      auth:['SU','admin','','']
    },
    {
      id:'Files',
      icon:'cloud_download', 
      route:'files', 
      dis:false, 
      auth:['SU','admin','adminS','tech','']
    },
    {
      id:'Users',
      icon:'people', 
      route:'users', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Access',
      icon:'done_all', 
      route:'auth', 
      dis:false, 
      auth:['SU','admin','adminS','','']
    },
    {
      id:'Report',
      icon:'receipt_long', 
      route:'report', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Visit',
      icon:'recent_actors', 
      route:'visit', 
      dis:false, 
      auth:['SU','adminS','sales','']
    },
    {
      id:'Parts',
      icon:'construction', 
      route:'parts', 
      dis:false, 
      auth:['SU','admin','adminS','tech','customer']
    },
  ];
  subsList: Subscription[]=[]
  uId:string=''
  constructor(public router :Router, public auth:AuthServiceService) {}
  
  ngOnInit(): void {
    
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.nome = a.Nome + ' ' + a.Cognome
        this.spin=false
        this.uId=a.uid
      })
    )
    
  }

  chOnline(){
    if(navigator.onLine) return false
    return true
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }
  
  nav(route:string, au:any){
    this.router.navigate([route])
  }  

  contr(a:string[]):boolean{
    if(a.includes(this.pos? this.pos:'')) return false
    return true
  }
}
 