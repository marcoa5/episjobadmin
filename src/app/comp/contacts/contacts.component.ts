import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import { auth } from 'firebase-admin';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';
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
  alfaLow:string[]=[]
  alfaUp:string[]=[]
  subsList:Subscription[]=[]

  constructor(public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService, private makeid: MakeidService) { 
    auth.getContact()
  }

  ngOnInit(): void {
    this.alfaLow='abcdefghijklmnopqrstuvwxyz'.split('')
    this.alfaUp=this.alfaLow.map(l=>l.toUpperCase())
    console.log(this.alfaLow,this.alfaUp)
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Internal',this.pos)
        }, 1);
      }),
      this.auth._contacts.subscribe((a:any[])=>{
        this.contacts=a.sort((b:any,c:any)=>{
          if(b.name>c.name) return 1
          if(b.name<c.name) return -1
          return 0
        })
        if(a.length>0){
          a.forEach(e => {
            firebase.database().ref('CustomerC').child(e.id).once('value',b=>{
              e['company'] = b.val().c1
            })
          });
        }
      })
    )
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
        let old=this.filtro
        this.filtro=''
        setTimeout(() => {
          this.filtro=old
        }, 0.1);
      }
    })
  }
  
}
