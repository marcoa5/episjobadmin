import { Router } from '@angular/router'
import { Component, Inject, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import * as moment from 'moment'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notif:any[]=[]
  subsList:Subscription[]=[]
  userId:string=''
  spin:boolean=true
  selected:any[]=[]
  constructor(private router: Router, private auth: AuthServiceService, public dialogRef: MatDialogRef<NotificationListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ){}

  ngOnInit(): void {
    let ora = moment(new Date()).subtract(30, 'days').format('YYYYMMDD')
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.userId=a.uid
        firebase.database().ref('Notif').child(a.uid).on('value',b=>{
          if(b.val()!=null) {
            this.notif=Object.values(b.val()).reverse()
          } else {
            this.notif=[]
          }
          b.forEach(c=>{
            let f = moment(c.val().date).format('YYYYMMDD')
            if(f<ora && c.key) firebase.database().ref('Notif').child(a.uid).child(c.key).remove()
          })
        this.spin=false
        })
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  read(a:any){
    if(a.status==0) firebase.database().ref('Notif').child(a.userId).child(a.date).child('status').set(1)
    if(a.status==1) firebase.database().ref('Notif').child(a.userId).child(a.date).child('status').set(0)
  }

  del(a:any){
    firebase.database().ref('Notif').child(a.userId).child(a.date).remove()
  }

  go(a:any){
    let c = (a.url.split(','))
    let d = [c[0],JSON.parse(c[1])]
    if(a.status==0) firebase.database().ref('Notif').child(a.userId).child(a.date).child('status').set(1)
    let u = this.router.url.split(';')
    if(u[0]=='/machine') {
      this.router.navigate([u[0],d[1]])
    } else {
      this.router.navigate(d)
    }
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }

  select(a:any, e:any){
    let i = this.selected.indexOf(a)
    if(e.checked) {
      if(i==-1) this.selected.push(a)
    } else {
      if(i>-1) this.selected.splice(i,1)
    }
    this.selected.sort((a:any,b:any)=>{
      if(a>b) return 1
      if(a<b) return -1
      return 0
    })
  }

  selectAll(){
    this.notif.forEach((a,index)=>{
      this.selected.push(index)
    })
  }

  setRead(n:number){
    this.selected.forEach(a=>{
      firebase.database().ref('Notif').child(this.notif[a].userId).child(this.notif[a].date).child('status').set(n)
    })
    this.selected=[]
  }

  delete(){
    this.selected.forEach(a=>{
      firebase.database().ref('Notif').child(this.notif[a].userId).child(this.notif[a].date).remove()
    })
  }
}
