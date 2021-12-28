import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { NewcontactComponent } from '../util/dialog/newcontact/newcontact.component';
@Component({
  selector: 'episjob-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts:any[]=[]
  filtro:string=''
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
