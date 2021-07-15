import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pos:string=''
  spin:boolean=true
  buttons:any = [
    {
      id:'Companies',
      icon:'work', 
      route:'customers', 
      dis:false, 
      auth:['SU','admin','tech','sales']
    },
    {
      id:'Equipment',
      icon:'precision_manufacturing', 
      route:'rigs', 
      dis:false, 
      auth:['SU','admin','tech','sales']
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
      auth:['SU','admin','tech','']
    },
    {
      id:'Users',
      icon:'account_box', 
      route:'users', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Contracts',
      icon:'description', 
      route:'contracts', 
      dis:true, 
      auth:['SU','admin','','']
    },
    {
      id:'Auth',
      icon:'checklist', 
      route:'auth', 
      dis:false, 
      auth:['SU','admin','','']
    },
    {
      id:'Report',
      icon:'receipt_long', 
      route:'report', 
      dis:false, 
      auth:['SU','admin','','']
    },
    {
      id:'Visit (BETA)',
      icon:'recent_actors', 
      route:'visit', 
      dis:false, 
      auth:['SU','admin','sales','']
    },
  ];

  constructor(public router :Router) { }
  ngOnInit(): void {

    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/'+a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
      .then(()=>{
        this.spin=false
      })
    })
  }

  nav(route:string){
    this.router.navigate([route])
  }  

  contr(a:string[]):boolean{
    if(a.includes(this.pos? this.pos:'')) return false
    return true
  }
}
