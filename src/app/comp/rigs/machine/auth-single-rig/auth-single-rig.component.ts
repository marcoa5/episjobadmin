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
  salesMen:any[]=[]
  constructor() { }

  ngOnInit(): void {
    firebase.database().ref('Users').once('value',a=>{
      let temp:any[]=[]
      if(a.val()!=null){
        a.forEach(b=>{
          let nr:number=b.val().Area
          if(nr>0 &&  nr<90 && b.val().Pos=='sales') {
            this.salesMen.push({name:b.val().Nome + ' ' + b.val().Cognome,area:b.val().Area})
          }
        })
      }
    }).then(()=>{this.sort(this.salesMen)})
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

  sort(arr:any[]){
    arr.sort((b:any,c:any)=>{
      if(b.area>c.area) return 1
      if(b.area<c.area) return -1
      return 0
    })
  }
}
