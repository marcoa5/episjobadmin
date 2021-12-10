import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment'
@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor() { }

  newNotification(userId:string[], text: string, auth: string, service: string){
    userId.forEach(a=>{
      firebase.database().ref('Users').child(a).child(service).once('value',s=>{
        if(s.val()!=null && s.val()==1) {
          firebase.database().ref('Notif').child(a).child(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).set({
            text: text,
            auth: auth,
            status: 0,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            userId: a
          })
        } 
      })
    })
  }
}
