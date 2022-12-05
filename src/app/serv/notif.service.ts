import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import * as moment from 'moment'
@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor() { }

  newNotification(userId:string[], title:string, text: string, auth: string, service: string, url:string){
    userId.forEach(a=>{
      firebase.database().ref('Users').child(a).child(service).once('value',s=>{
        if(s.val()!=null && s.val()==1) {
          firebase.database().ref('Notif').child(a).child(moment.tz(new Date(),'Europe/Rome').format('YYYY-MM-DD HH:mm:ss')).set({
            title: title,
            text: text,
            auth: auth,
            status: 0,
            date: moment.tz(new Date(),'Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
            userId: a,
            url:url
          })
        } 
      })
    })
  }
}
