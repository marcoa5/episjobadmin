import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from '../../serv/back.service'
import { from } from 'rxjs'
import * as firebase from 'firebase/app'
import 'firebase/database'

@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  rigs:any;

  @Output() mTitle = new EventEmitter<string>()

  constructor(public router: Router, public bak:BackService) { }

  ngOnInit(): void {
    this.mTitle.emit('Rigs')
    firebase.default.database().ref('MOL').once('value')
    .then(snap=>{
      this.rigs=Object.values(snap.val())
    })
    
  }

  back(){
    this.bak.backP()
  }

  open(a: String, b:String, c:String){
    alert(`Modello: ${a} \n S/N: ${b} \n Cliente: ${c}`)
  }
}
