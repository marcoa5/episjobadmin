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
  constructor() { }

  ngOnInit(): void {
    firebase.database().ref('Tech').once('value',a=>{
      this.tech=Object.keys(a.val())
    })
  }

  filter(a:any){
    this.filtro=a
  }

}
