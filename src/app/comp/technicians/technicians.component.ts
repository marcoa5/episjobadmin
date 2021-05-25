import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'

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
    firebase.default.database().ref('Tech').once('value',a=>{
      this.tech=Object.keys(a.val())
    })
  }

  filter(a:any){
    this.filtro=a
  }

}
