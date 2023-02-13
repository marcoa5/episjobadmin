import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';
import { CustomersComponent } from '../customers/customers.component';
import { NewcontactComponent } from '../util/dialog/newcontact/newcontact.component';
import { NewcontactcustomerselectionComponent } from './newcontactcustomerselection/newcontactcustomerselection.component';
import { SelectcustomerComponent } from './selectcustomer/selectcustomer.component';
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
  sortBut:boolean=true
  sortBy:string='name'
  val:any
  subsList:Subscription[]=[]

  constructor(public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService, private makeid: MakeidService) { 
    auth.getContact()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<700){
      this.sortBut=false
      this.sortList(this.sortBy+',1')
    }else{
      this.sortBut=true
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.alfaLow='abcdefghijklmnopqrstuvwxyz'.split('')
    this.alfaUp=this.alfaLow.map(l=>l.toUpperCase())
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Internal',this.pos)
        }, 1);
      }),
      this.auth._customers.subscribe(a=>{
        if(a) this.customers=a
      }),
      this.auth._contacts.subscribe((a:any[])=>{
        this.contacts=a
        this.sortList(this.sortBy+',1')
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

  sortList(value:any){
    let by:string =value.split(',')[0]
    let val:number =parseInt(value.split(',')[1])
    this.sortBy=by
    this.contacts.sort((b:any,c:any)=>{
      if(b[by].toLowerCase()>c[by].toLowerCase()) return val
      if(b[by].toLowerCase()<c[by].toLowerCase()) return -val
      return 0
    })
  }

  addNew(e:any){
    let dia=this.dialog.open(NewcontactcustomerselectionComponent,{panelClass: 'custselect', data:''})
    dia.afterClosed().subscribe(res=>{
      if(res){
        let info:any = this.customers[this.customers.map(a=>{return a.id}).indexOf(res)]
        let d = this.dialog.open(NewcontactComponent, {data: {id: info.id, type: 'new'}})
      }
    })
    
  }
  
}
