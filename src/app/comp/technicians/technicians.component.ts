import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import 'firebase/database'

@Component({
  selector: 'episjob-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  tech:any[]=[]
  filtro:string=''
  pos:string|undefined
  constructor() { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/'+a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
    })
    firebase.database().ref('Tech').once('value',a=>{
      this.tech=Object.keys(a.val())
    })
  }

  filter(a:any){
    this.filtro=a
  }

}
