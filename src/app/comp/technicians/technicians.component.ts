import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import 'firebase/database'
import { Router } from '@angular/router'

@Component({
  selector: 'episjob-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  tech:any[]=[]
  filtro:string=''
  pos:string|undefined
  constructor(private router:Router) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/'+a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
    })
    firebase.database().ref('Tech').on('value',a=>{
      a.forEach(b=>{
        this.tech.push({l: b.key,s:b.val().s})
      })
    })
  }

  filter(a:any){
    this.filtro=a
  }

  tec(a:string, b:string){
    this.router.navigate(['newtech',{fn: a, sn: b}])
  }

}
