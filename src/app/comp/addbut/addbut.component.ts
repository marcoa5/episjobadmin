import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'


@Component({
  selector: 'episjob-addbut',
  templateUrl: './addbut.component.html',
  styleUrls: ['./addbut.component.scss']
})
export class AddbutComponent implements OnInit {
  pos:string|undefined
  @Input() fun:string|undefined
  constructor(private router: Router) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref(`Users/${a?.uid}/Pos`).once('value',b=>{
        this.pos=b.val()
      })
    })
  }

  new(){
    if(this.pos=='SU') this.router.navigate([this.fun])
  }
}
