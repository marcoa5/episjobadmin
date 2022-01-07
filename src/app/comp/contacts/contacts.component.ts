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
  customers:any[]=[]
  constructor(public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService) { 
    auth.getContact()
    auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=auth.allow('contacts')
      }, 1);
    })
    auth._customers.subscribe(a=>{this.customers=a}) 
    auth._contacts.subscribe((a:any[])=>{
      this.contacts=a
      a.forEach(e => {
        if(this.customers.length>0) {
          let i =(this.customers.map(a=>{return a.id}).indexOf(e.company))
          e['company'] = this.customers[i].c1
          e['id'] = this.customers[i].id
        }
      });
    })
  }

  ngOnInit(): void {
    this.allSpin=false
  }

  filter(a:any){
    this.filtro=a
  }

  go(c:any){
    console.log(c)
    const dialogRef = this.dialog.open(NewcontactComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        //this.newCont.emit(result)
      }
    })
  }
}
