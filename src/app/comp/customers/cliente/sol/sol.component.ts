import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-sol',
  templateUrl: './sol.component.html',
  styleUrls: ['./sol.component.scss']
})
export class SolComponent implements OnInit {
  @Input() custId:string=''
  @Input() customerName:string=''
  check!:FormGroup
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService) {
    this.check = new FormGroup({})
    this.check.addControl('cb',new FormControl(''))
  }

  ngOnInit(): void {
    firebase.database().ref('SOL').child(this.custId).child('sol').once('value',a=>{
      this.check.controls.cb.setValue(a.val())
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  ch(){
    firebase.database().ref('SOL').child(this.custId).child('sol').set(this.check.controls.cb.value)
  }

}
