import { Component, OnInit } from '@angular/core';
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
  constructor(public router: Router, public bak:BackService) { }

  ngOnInit(): void {
    firebase.default.database().ref('MOL').once('value')
    .then(snap=>{
      this.rigs=Object.values(snap.val())
    })
    
  }

  back(){
    this.bak.backP()
  }

}
