import { Component, OnInit, Input } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import firebase from 'firebase'
@Component({
  selector: 'episjob-auth-single-rig',
  templateUrl: './auth-single-rig.component.html',
  styleUrls: ['./auth-single-rig.component.scss']
})
export class AuthSingleRigComponent implements OnInit {
  largh:number=0
  @Input() sn:string|undefined
  a1:number=0
  a2:number=0
  a3:number=0
  a4:number=0
  a5:number=0
  appearance:MatFormFieldAppearance="fill"
  minWidth:number = 1100;
  constructor() { }

  ngOnInit(): void {
    this.largh=window.innerWidth
    firebase.database().ref('RigAuth/' + this.sn).once('value',a=>{
      this.a1 = a.val().a1?a.val().a1:0
      this.a2 = a.val().a2?a.val().a2:0
      this.a3 = a.val().a3?a.val().a3:0
      this.a4 = a.val().a4?a.val().a4:0
      this.a5 = a.val().a5?a.val().a5:0
    })
  }

  larg(){
    this.largh=window.innerWidth
  }

  ch(a:number, e:any){
    firebase.database().ref('RigAuth/' + this.sn).child('a' + a).set(e.checked==true? 1 : 0)
  }

  title(){
    this.largh=window.innerWidth
    if(this.largh<600) return 'Authorizations'
    return 'Sales Authorizations'
  }
}
