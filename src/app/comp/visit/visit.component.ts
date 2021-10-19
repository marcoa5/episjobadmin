import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
//import 'firebase/database'
//import 'firebase/auth'

@Component({
  selector: 'episjob-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  pos:string|undefined
  constructor() {}

  ngOnInit(): void {
     firebase.auth().onAuthStateChanged(a=>{
       if(a) firebase.database().ref('Users').child(a.uid).once('value',b=>{
         this.pos = b.val().Pos
       })
     })
  }
   
  auth(){
    if (this.pos=='SU' || this.pos=='admin' || this.pos=='sales') return true
    return false
  }
}
