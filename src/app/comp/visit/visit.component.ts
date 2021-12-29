import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
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
  pos:string=''
  day: string=moment(new Date()).format('YYYY-MM-DD')
  
  userId:string=''
  ref:boolean=false
  allSpin:boolean=true
  allow:boolean=false

  constructor(private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a.day) this.day=a.day
      
    })
     firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        this.userId=a.uid
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.pos = b.val().Pos
        })
        .then(()=>{
          this.allSpin=false
          this.auth()
        })
      }
    })
  }
   
  auth(){
    if (this.pos=='SU' || this.pos=='adminS' || this.pos=='sales') {
      this.allow=true
    } else {
      this.allow=false
    }
  }

  chDay(e:any){
    this.day=e
  }

  refresh(e:any){
    if(e=='ref'){
      let prev = this.day
      this.day=''
      setTimeout(() => {
        this.day=prev
      }, 10);
    } else {
      this.day=e
    }
    
    
  }
}
