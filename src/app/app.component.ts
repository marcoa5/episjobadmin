import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { Location } from '@angular/common'
const firebaseConfig = {
  apiKey: "AIzaSyBtO5C1bOO70EL0IPPO-BDjJ40Kb03erj4",
  authDomain: "epi-serv-job.firebaseapp.com",
  databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com",
  projectId: "epi-serv-job",
  storageBucket: "epi-serv-job.appspot.com",
  messagingSenderId: "793133030101",
  appId: "1:793133030101:web:a79f477c42cb9e0a53a05c",
  measurementId: "G-C2CPM0MBH8"
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'episjobadmin';
  userN:string | undefined;
  orient: boolean | undefined
  titolo: string | undefined
  showFiller:boolean=false;
  
  ngOnInit(){
    firebase.default.initializeApp(firebaseConfig)
    this.onResize()
    firebase.default.auth().onAuthStateChanged(a=>{
      if(!a) {
        this.userN = 'null'
      } else {
        firebase.default.database().ref('Users/' + a.uid). once('value',s=>{
          this.userN = s.val().Nome.substring(0,1) + s.val().Cognome.substring(0,1)
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerHeight<window.innerWidth){
      this.orient=true
    } else {
      this.orient = false
    }
  }
  userName(a:any){
    this.userN=a
  }

  logout(){
    firebase.default.auth().signOut()
  }

  userExists(){
    if(this.userN && this.userN!='null') return true
    return false 
  }
}
