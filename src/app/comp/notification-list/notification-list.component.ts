import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import * as moment from 'moment'
@Component({
  selector: 'episjob-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notif:any[]=[]
  constructor(public router: Router) { }

  ngOnInit(): void {
    let ora = moment(new Date()).subtract(30, 'days').format('YYYYMMDD')
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Notif').child(a.uid).on('value',b=>{
          if(b.val()!=null) {
            this.notif=Object.values(b.val())
          } else {
            this.notif=[]
          }
          b.forEach(c=>{
            let f = moment(c.val().date).format('YYYYMMDD')
            if(f<ora && c.key) firebase.database().ref('Notif').child(a.uid).child(c.key).remove()
          })
        })
      }
    })
  }

  read(a:any){
    if(a.status==0) firebase.database().ref('Notif').child(a.userId).child(a.date).child('status').set(1)
    if(a.status==1) firebase.database().ref('Notif').child(a.userId).child(a.date).child('status').set(0)
  }

  del(a:any){
    firebase.database().ref('Notif').child(a.userId).child(a.date).remove()
  }

  go(a:any){
    this.router.navigate([a.url])
  }
}
