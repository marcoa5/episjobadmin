import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ResetPwdComponent } from '../util/reset-pwd/reset-pwd.component'
import { Router } from '@angular/router'



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
  chErr:boolean=false
  constructor(fb: FormBuilder,private dialog: MatDialog, private router:Router) {
    this.form = fb.group({
      username: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]]
    })
   }

  ngOnInit(): void {
    //this.login('marco.arato@epiroc.com','Epiroc2021')
    firebase.auth().onAuthStateChanged((a)=>{
      //if (a) console.log(a)
    })
  }

  login(a: FormGroup){
    this.spin=true
    let una = a.get('username')?.value
    let pwd = a.get('password')?.value
    firebase.auth().signInWithEmailAndPassword(una,pwd)
    .then((a)=>{
       firebase.database().ref('Users/' + a.user?.uid ).once('value')
       .then(snap=>{
         var b = snap.val()
         this.uN = b.Nome.substring(0,1) + b.Cognome.substring(0,1)
         this.userN.emit(this.uN)
         if(b.Pos=='sales') this.router.navigate(['rigs'])
         this.spin=false

       })
       .catch(err=>{
        if(err) {
          console.log(err)
        }
        this.spin=false
       })
    })
    .catch(err=>{
      if (err) {
        
        this.chErr=true
        this.spin=false
        console.error(err)
      }
    })
  }

  delChErr(){
    this.chErr=false
  }

  c(a:FormGroup){
    let b=a.get('username')?.invalid
    let d=a.get('password')?.invalid
    if(b||d) return true
    return false
  }

  reset(a:any){
    const dialogconf = new MatDialogConfig();
        dialogconf.disableClose=false;
        dialogconf.autoFocus=false;
        const dialogRef = this.dialog.open(ResetPwdComponent, {
          data: {mail: a}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if(result!=undefined) {
            firebase.auth().sendPasswordResetEmail(result)
            .then(()=>alert(`Email sent to: ${result}`))
            .catch((err)=>console.log(err))
          }
        })
  }



}
