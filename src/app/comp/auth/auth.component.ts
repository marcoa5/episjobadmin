import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import { observable } from 'rxjs';
@Component({
  selector: 'episjob-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  pos:string|undefined
  rigs:any[]=[]
  filtro:string=''
  wid:boolean=true
  constructor() { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).child('Pos').once('value',b=>{
        this.pos = b.val()
      })
    })
    firebase.database().ref('MOL')
    .once('value',a=>{
      a.forEach(b=>{
        firebase.database().ref('RigAuth/' + b.val().sn).once('value',c=>{
          this.rigs.push({sn: b.val().sn, customer: b.val().customer,model: b.val().model,a1: c.val().a1,a2: c.val().a2,a3: c.val().a3,a4: c.val().a4})
        })
      })
    })
    
    
    
  }

  filter(e:any){
    this.filtro=e
  }

  cl(e:any, a:string, b:string){
    let g = e.checked? 1 : 0
    firebase.database().ref('RigAuth/' + a).child(b).set(g)
  }

  res(){
    if(window.innerWidth<600) {
      this.wid=false
    } else {
      this.wid=true
    }
  }

}
