import { Injectable } from '@angular/core';
import firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class SumWsHrsService {

  constructor() { }

  sum(data:any){
    let sum:number=0
    firebase.database().ref('wsFiles').child('open').child(data.sn).child(data.id).child('days').once('value',a=>{
      sum=0
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            if(c.key=='v1' || c.key=='v2' || c.key=='v8') sum+=c.val()
          })
        })
      }
    })
    .then(()=>{
      firebase.database().ref('wsFiles').child('open').child(data.sn).child(data.id).child('hrs').set(sum)
    })
  }
}
