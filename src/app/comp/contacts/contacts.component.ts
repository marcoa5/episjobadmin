import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import { auth } from 'firebase-admin';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
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
  subsList:Subscription[]=[]

  constructor(public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService) { 
    auth.getContact()
  }

  ngOnInit(): void {
    this.subsList.push(this.auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('contacts')
      }, 1);
    }),
    this.auth._customers.subscribe(a=>{this.customers=a}), 
    this.auth._contacts.subscribe((a:any[])=>{
      this.contacts=a
      a.forEach(e => {
        if(this.customers.length>0) {
          let i =(this.customers.map(a=>{return a.id}).indexOf(e.company))
          if(i){
            e['company'] = this.customers[i].c1
            e['id'] = this.customers[i].id
          }
        }
      });
    }))
    this.allSpin=false
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    this.filtro=a
  }

  go(c:any){
    const dialogRef = this.dialog.open(NewcontactComponent, {data: {info:c}})

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        //this.newCont.emit(result)
      }
    })
  }
  
}
