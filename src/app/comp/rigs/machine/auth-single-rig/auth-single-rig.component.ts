import { Component, OnInit, Input } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Component({
  selector: 'episjob-auth-single-rig',
  templateUrl: './auth-single-rig.component.html',
  styleUrls: ['./auth-single-rig.component.scss']
})
export class AuthSingleRigComponent implements OnInit {
  largh:number=0
  @Input() sn:string=''
  a:number[]=[0,0,0,0,0]
  minWidth:number = 1100;
  salesMen=[
    {name: 'Claudio Cossu', area:1},
    {name: 'Valentino Rizzieri', area:2},
    {name: 'Federico Angheben', area:3},
    {name: 'Antonio Marchiò', area:4},
    {name: 'Salvatore Di Benedetto', area:5},
  ]
  constructor() { }

  ngOnInit(): void {
    this.largh=window.innerWidth
    firebase.database().ref('RigAuth').child(this.sn).on('value',a=>{
      if(a.val()!=null){
        this.a[1] = a.val().a1?a.val().a1:0
        this.a[2] = a.val().a2?a.val().a2:0
        this.a[3] = a.val().a3?a.val().a3:0
        this.a[4] = a.val().a4?a.val().a4:0
        this.a[5] = a.val().a5?a.val().a5:0
      }
    })
  }

  larg(){
    this.largh=window.innerWidth
  }

  ch(a:number, e:any){
    firebase.database().ref('RigAuth').child(this.sn).child('a' + a).set(e.checked==true? '1' : '0')
  }

  title(){
    this.largh=window.innerWidth
    if(this.largh<600) return 'Authorizations'
    return 'Sales Authorizations'
  }
}
