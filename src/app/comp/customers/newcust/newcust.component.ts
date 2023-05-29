import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog'
import { UpddialogComponent } from '../../util/dialog/upddialog/upddialog.component'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { MakeidService } from '../../../serv/makeid.service'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CustalreadyexistdialogComponent } from '../../util/dialog/custalreadyexistdialog/custalreadyexistdialog.component';
import 'moment-timezone'
import { environment } from 'src/environments/environment';

export interface cl {
  c1: string
  c2: string
  c3: string
  id: string
  code:string
}

@Component({
  selector: 'episjob-newcust',
  templateUrl: './newcust.component.html',
  styleUrls: ['./newcust.component.scss']
})
export class NewcustComponent implements OnInit {
  @Output() dati = new EventEmitter<string>()
  newC:FormGroup;
  addUpd:boolean=true
  origin:string[]=[]
  or:any={}
  pos:string=''
  rou:any[]=[]
  checkChanges:boolean=true
  customers:any[]=[]
  allow:boolean=false
  subsList:Subscription[]=[]
  constructor(private auth: AuthServiceService, private fb:FormBuilder, private location:Location, private route:ActivatedRoute, private router:Router, private dialog:MatDialog, public makeId:MakeidService) {
    this.newC = fb.group({
      name:['',[Validators.required]],
      address1: ['',[Validators.required]],
      address2: ['',[Validators.required]],
      code:['']
    })
    this.auth._userData.subscribe(a=>{
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('SU',this.pos)
      }, 1);
    })
   }

  ngOnInit(): void {
    this.allow=this.auth.allow('SU',this.pos)
    this.subsList.push(
      this.auth._customers.subscribe(a=>{
        if(a) this.customers=a
      })
    )
    this.route.params.subscribe(a=>{
      if(a.id && a.c1 && a.c2 && a.c3) {
        this.or=a
        this.origin=[a.id,a.c1,a.c2,a.c3,a.code]
        this.newC = this.fb.group({
          name:[a.c1,[Validators.required]],
          address1: [a.c2,[Validators.required]],
          address2: [a.c3,[Validators.required]],
          code: [a.code],
        })
        this.addUpd=false
        this.rou=['cliente',{id: a.id}]
      } else {
        this.rou=['customers']
      }
    })
    this.newC.valueChanges.subscribe(t=>{
      let ch1:boolean=t.address1==this.or.c2
      let ch2:boolean=t.address2==this.or.c3
      let ch3:boolean=t.code==this.or.code
      let ch4:boolean=t.name==this.or.c1
      if(ch1&&ch2&&ch3&&ch4) {
        this.checkChanges=true
      } else {
        this.checkChanges=false
      }
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  add(e:any, a:FormGroup){
    let g:cl ={
      c1: a.get('name')?.value.toUpperCase(),
      c2: a.get('address1')?.value.toUpperCase(),
      c3: a.get('address2')?.value.toUpperCase(),
      code: a.get('code')?.value.toUpperCase(),
      id: this.origin[0]!=''? this.origin[0] : this.makeId.makeId(10)
    }
    if(e=='updc' && this.allow){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {cust: this.origin[1]!=undefined?this.origin[1]: '', name: this.origin[0], title:'Update'}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.allow) {
          firebase.database().ref('CustomerC').child(this.origin[0]).set(g)
          .then(()=>{
            if(this.origin[1]!=g.c1){
              firebase.database().ref('MOL').orderByChild('customer').equalTo(this.origin[1]).once('value',f=>{
                Object.keys(f.val()).forEach(e=>{
                  firebase.database().ref('MOL/' + e + '/customer').set(g.c1)
                })
              })
            }
            firebase.database().ref('Updates').child('Custupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
            this.router.navigate(['cliente',{id:this.origin[0]}])
          })
          .catch(err=> console.log(err))
          
        }
      })
    } else if(e=='addc' && this.allow){
      let result= this.customers.filter(o=>{
        return o.c1 == g.c1
      })
      if(result.length==0){
        let newId = this.makeId.makeId(10)
        g.id = newId
        firebase.database().ref('CustomerC').child(newId).set(g)
        .then(()=>{
          firebase.database().ref('Updates').child('Custupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
          this.location.back()
        })
        .catch(err=> console.log(err))
      } else {
        this.dialog.open(CustalreadyexistdialogComponent, {data: g.c1})
      }
    }
  }

  back(){
    this.location.back()
  }

}
