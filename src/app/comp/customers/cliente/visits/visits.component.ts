import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/app'
@Component({
  selector: 'episjob-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {
  @Input() userId:string=''
  @Input() pos:string=''
  @Input() custId:string=''
  constructor() { }

  ngOnInit(): void {
    console.log(this.userId,this.pos, this.custId)
    firebase.database().ref('CustVisit').child('cuId').once('value',a=>{
      console.log(a.val())
    })
  }

}
