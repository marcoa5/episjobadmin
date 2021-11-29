import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  pos:string=''
  SJ:any|undefined
  Visit:any|undefined
  id:string=''
  constructor(public dialogRef: MatDialogRef<LogoutComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a!=null) {
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.id= a.uid
          this.pos=b.val().Pos
          this.SJ=b.val().sj
          this.Visit=b.val().visit
        })
      }
    })
    
  }

  mod(e:any, b:string){
    firebase.database().ref('Users').child(this.id).child(b).set(e.checked? '1' : '0')
  }

  logout(){
    this.onNoClick()
    firebase.auth().signOut()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
