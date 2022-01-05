import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import { auth } from 'firebase-admin';
import firebase from 'firebase/app'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewcontactComponent } from '../util/dialog/newcontact/newcontact.component';
@Component({
  selector: 'episjob-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts:any[]=[]
  filtro:string=''
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  constructor(public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService) { 
    auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=auth.allow('contacts')
      }, 1);
    })
  }

  ngOnInit(): void {
    
    /*firebase.auth().onAuthStateChanged(a=>{
      if(a!=null) {
        firebase.database().ref('Users').child(a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
          if(this.auth.includes(this.pos)) {this.allow=true}
        })
        .then(()=>{
          
        })
      }
    })*/

    this.allSpin=false
    firebase.database().ref('Contacts').on('value',a=>{
      this.contacts=[]
      a.forEach(b=>{
        b.forEach(c=>{
          let cont = c.val()
          if(b.key) {
            firebase.database().ref('CustomerC').child(b.key).once('value',d=>{
              cont['company']=d.val().c1
              cont['id']=b.key
            })
          }
          this.contacts.push(cont)
        })
      })
    })
  }

  filter(a:any){
    this.filtro=a
  }

  go(c:any){
    const dialogRef = this.dialog.open(NewcontactComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        //this.newCont.emit(result)
      }
    })
  }
}
