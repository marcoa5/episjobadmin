import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import * as moment from 'moment';
//import 'firebase/database'
//import 'firebase/auth'

@Component({
  selector: 'episjob-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  pos:string|undefined
  day: string=moment(new Date()).format('YYYY-MM-DD')
  userId:string=''
  constructor() {}

  ngOnInit(): void {
     firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        this.userId=a.uid
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.pos = b.val().Pos
        })
      }
    })
  }
   
  auth(){
    if (this.pos=='SU' || this.pos=='adminS' || this.pos=='sales') return true
    return false
  }

  chDay(e:any){
    this.day=e
  }
}
