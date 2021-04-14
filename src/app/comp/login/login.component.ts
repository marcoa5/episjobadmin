import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import * as firebase from 'firebase';



@Component({
  selector: 'episjob-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() userN = new EventEmitter<string>()
  uN:string|undefined
  vis:boolean=true;
  stile:string="standard"
  constructor() { }

  ngOnInit(): void {
    //this.login('marco.arato@epiroc.com','Epiroc2021')
    firebase.default.auth().onAuthStateChanged((a)=>{
      //if (a) console.log(a)
    })
  }

  login(un:string,pw:string){
    console.log(un,pw)
    firebase.default.auth().signInWithEmailAndPassword(un,pw)
    .then((a)=>{
       firebase.default.database().ref('Users/' + a.user?.uid ).once('value')
       .then(snap=>{
         var b = snap.val()
         this.uN = b.Nome.substring(0,1) + b.Cognome.substring(0,1)
         this.userN.emit(this.uN)
       })
    })
    .catch(err=>{if (err) console.error(err)})
  }

}
