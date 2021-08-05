import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss']
})
export class NewvisitComponent implements OnInit {

  customers:string[]=[]

  constructor() {
  }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').orderByChild('c1').once('value',p=>{
      p.forEach(y=>{
        this.customers.push(y.val().c1)
      })
    })
  }

  newDate(e:any){
    console.log(e)
  }

  newCust(e:any){
    console.log(e)
  }

}
