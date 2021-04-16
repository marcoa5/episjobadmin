import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  spin:boolean=false
  form:any
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      username: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]]
    })
   }

  ngOnInit(): void {
    //this.login('marco.arato@epiroc.com','Epiroc2021')
    firebase.default.auth().onAuthStateChanged((a)=>{
      //if (a) console.log(a)
    })
  }

  login(a: FormGroup){
    this.spin=true
    let una = a.get('username')?.value
    let pwd = a.get('password')?.value
    firebase.default.auth().signInWithEmailAndPassword(una,pwd)
    .then((a)=>{
       firebase.default.database().ref('Users/' + a.user?.uid ).once('value')
       .then(snap=>{
         var b = snap.val()
         this.uN = b.Nome.substring(0,1) + b.Cognome.substring(0,1)
         this.userN.emit(this.uN)
         this.spin=false
       })
       .catch(err=>{
         if(err) console.log(err)
         this.spin=false
       })
    })
    .catch(err=>{
      if (err) console.error(err)
      this.spin=false
    })
  }

  c(a:FormGroup){
    let b=a.get('username')?.invalid
    let d=a.get('password')?.invalid
    if(b||d) return true
    return false
  }

}
