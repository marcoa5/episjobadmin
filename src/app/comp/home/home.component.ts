import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as moment from 'moment';

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
      dis:false, 
      auth:['SU','admin','adminS','tech','sales','customer']
    },
    {
      id:'Companies',
      icon:'work', 
      route:'customers', 
      dis:false, 
      auth:['SU','admin','adminS','tech','sales','customer']
    },
    {
      id:'Contacts',
      icon:'people', 
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
      icon:'account_box', 
      route:'users', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Auth',
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
      auth:['SU','admin','','']
    },
    {
      id:'Visit',
      icon:'recent_actors', 
      route:'visit', 
      dis:false, 
      auth:['SU','adminS','sales','']
    },
    /*{
      id:'Potential',
      icon:'trending_up', 
      route:'potential', 
      dis:false, 
      auth:['SU','adminS','sales','']
    },
    {
      id:'To Do',
      icon:'checklist', 
      route:'todo', 
      dis:false, 
      auth:['SU','adminS','sales','']
    },*/
    {
      id:'Parts',
      icon:'construction', 
      route:'parts', 
      //dis:true, 
      auth:['SU','admin','adminS','tech','']
    },
  ];

  constructor(public router :Router) { 
    
  }
  ngOnInit(): void {

    let tokens:any[]=[]

    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/'+a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.nome=b.val().Nome + ' ' + b.val().Cognome
      })
      .then(()=>{
        this.spin=false
        if(firebase.messaging.isSupported()){
          const messaging = firebase.messaging()
          messaging.onMessage(p => {
            console.log('Received foreground message ', p)
          })
            messaging.getToken({vapidKey:'BETaY1oMq6ONzg-9B-uNHl27r4hcKd5UVH-EgNEXLQ9kUzqDwGq8nZwZTDN0klxbC-Oz-nSz6yGTzDD0R4h_vXY'})
            .then(t=>{
              firebase.database().ref('Tokens').child(a!.uid).child(t).set({
                token: t,
                pos: this.pos,
                name: this.nome,
                date: moment(new Date()).format('YYYY-MM-DD - hh:mm:ss'),
                id:a?.uid,
              })
            })
            .catch(err=>console.log(err)) 
          }    
        }
      )
    })
  }

  nav(route:string, au:any){
    this.router.navigate([route])
  }  

  contr(a:string[]):boolean{
    if(a.includes(this.pos? this.pos:'')) return false
    return true
  }
}
 