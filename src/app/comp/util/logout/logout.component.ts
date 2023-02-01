import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import firebase from 'firebase/app'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'episjob-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  pos:string=''
  SJ:any|undefined
  Visit:any|undefined
  Newrig:any|undefined
  Certiq:any|undefined
  Balance:any|undefined
  id:string=''
  version:string=''
  constructor(public dialogRef: MatDialogRef<LogoutComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auth:AuthServiceService) { }

  ngOnInit(): void {
    this.version=environment.appVersion
    this.id= this.data.id
    this.pos=this.data.pos
    this.SJ=this.data.SJ
    this.Visit=this.data.Visit
    this.Newrig=this.data.Newrig
    this.Certiq=this.data.Certiq
    this.Balance=this.data.Balance
  }

  mod(e:any, b:string){
    firebase.database().ref('Users').child(this.id).child(b).set(e.checked? '1' : '0')
  }

  logout(){
    this.onNoClick()
    localStorage.clear()
    firebase.auth().signOut()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

  clearCache():void{
    localStorage.clear()
  }
}
