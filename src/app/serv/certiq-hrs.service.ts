import { Injectable } from '@angular/core';
import * as moment from 'moment'; 
import firebase from 'firebase/app'
import { NotifService } from './notif.service';
import { AuthServiceService } from './auth-service.service';
import { Subscription } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class CertiqHrsService {
  
  constructor(private notification:NotifService) { }

  calculateHrs(list:any, id:string){
    return new Promise((res,rej)=>{
      if(list) {
        let elenco = Object.keys(list)
        let len:number = elenco.length
        let index:number=0
        elenco.forEach(e=>{
          let item:any[]=list[e]
          let temp:any={}
          let upd:string =''
          item.forEach(i=>{
            if(upd=='' || upd<(moment(i.timeStamp).format('YYYYMMDD'))) upd=moment(i.timeStamp).format('YYYYMMDD')
            if(i.name=='cumulativeEngineHours') temp.orem=Math.round(i.value)
            if(i.name=='cumulativeDrillHours'){
              temp['perc'+i.nodeIndex]=Math.round(i.value)
            }
            temp.source='Automatic Certiq update'
          })
          if(temp.orem>10){
            if(temp.perc1!=undefined?temp.perc1>0:true && temp.perc2!=undefined?temp.perc2>0:true && temp.perc3!=undefined?temp.perc3>0:true) {
              console.log(e,upd,temp)
              firebase.database().ref('Hours').child(e).child(upd).set(temp)
            }
          }
          index++
          if(len==index) {
            firebase.database().ref('Updates').child('Certiqupd').set(moment(new Date()).format('YYYYMMDDHHmmss'))
            .then(()=>{
              let users:string[]=[]
              firebase.database().ref('Users').once('value',a=>{
                a.forEach(b=>{
                  if(b.val().Pos=='SU' && b.val()._certiq=='1'){
                    if(b.key) users.push(b.key)
                  }
                })
              })
              .then(()=>{
                this.notification.newNotification(users,'Certiq update','Running hours updated from Certiq','','_certiq','./rigs,{}')
                res(list)
              })
            })
          }
        })
      } 
    })
  }
}
