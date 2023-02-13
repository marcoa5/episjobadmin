import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import firebase from 'firebase/app'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeldialogComponent } from '../deldialog/deldialog.component';
import { MakeidService } from 'src/app/serv/makeid.service';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { TechniciansComponent } from 'src/app/comp/technicians/technicians.component';
import { of, Subscription } from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { NotifService } from 'src/app/serv/notif.service';

export interface co{
  id: string
  custName: string
}

@Component({
  selector: 'episjob-newcontact',
  templateUrl: './newcontact.component.html',
  styleUrls: ['./newcontact.component.scss']
})
export class NewcontactComponent implements OnInit {
  id:string=''
  newCont!:FormGroup
  
  oldName:string=''
  comp:any[]=[]
  contId:string=''
  rigs:any[]=[]
  inv:boolean=false
  nome:string=''
  subsList:Subscription[]=[]
  constructor(private notif: NotifService, private auth:AuthServiceService, private makeid:MakeidService, public dialogRef: MatDialogRef<NewcontactComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public fb: FormBuilder, public dialog: MatDialog) {
    this.id=data.id? data.id: data.info.id
    this.newCont=fb.group({
      id:[''],
      name: ['',Validators.required],
      surname: ['',Validators.required],
      pos: ['',Validators.required],
      phone: ['',[Validators.required, Validators.pattern]],
      mail: ['',[Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    this.newCont.valueChanges.subscribe(val=>{
      if(val.name && val.name==this.data.info.name && val.surname==this.data.info.surname && val.phone==this.data.info.phone && val.pos==this.data.info.pos && val.mail==this.data.info.mail) {
        this.inv=true
      }else{
        this.inv=false
      }
    })
    this.newCont.controls.id.disable()
    this.subsList.push(
      this.auth._fleet.subscribe(a=>{if(a) this.rigs=a}),
      this.auth._userData.subscribe(a=>{if(a){ this.nome =a.Nome + ' ' + a.Cognome}})
    )
    if(this.data.info!=undefined || this.data.info!=null){
      this.oldName=this.data.info.name + ' ' + this.data.info.surname
      this.newCont.controls.id.setValue(this.data.info.contId)
      this.newCont.controls.name.setValue(this.data.info.name)
      this.newCont.controls.surname.setValue(this.data.info.surname)      
      this.newCont.controls.pos.setValue(this.data.info.pos)
      this.newCont.controls.phone.setValue(this.data.info.phone)
      this.newCont.controls.mail.setValue(this.data.info.mail)
      this.contId=this.data.info.contId
    }
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  onNoClick(){
    this.dialogRef.close()
  }

  addContact(){
    if(this.data.type=='new') this.contId=this.makeid.makeId(5)
    let dat={
      name: this.newCont.controls.name.value.trim(),
      surname: this.newCont.controls.surname.value.trim(),
      pos: this.newCont.controls.pos.value,
      phone: this.newCont.controls.phone.value,
      mail: this.newCont.controls.mail.value,
      custId:this.id,
      contId: this.contId
    }
    let check:boolean=false
    
    firebase.database().ref('CustContacts').child(this.id).once('value',a=>{
      a.forEach(b=>{
        if(b.val().name==dat.name && b.val().surname==dat.surname) check =true
      })
    })
    .then(()=>{
      if(check && this.data.type=='new'){
        const al = this.dialog.open(AlertComponent, {data: dat.name + ' ' + dat.surname})
      }else{
        firebase.database().ref('CustContacts').child(this.id).child(dat.contId).set(dat)
        .then(()=>{
          this.sendNot(dat)
          this.dialogRef.close('created')
          this.auth.getContact()
        })
      }
    })
  }

  sendNot(info:any){
    let users:string[]=[]
    firebase.database().ref('Users').once('value',a=>{
      a.forEach(b=>{
        if((b.val().Pos=='SU' || b.val().Pos=='Admin' || b.val().Pos=='AdminS') && b.val()._newcont=='1'){
          if(b.key) users.push(b.key)
        }
      })
    })
    .then(()=>{
      let str= 'New Contact added/updated'
      let text:string='Contact "' + info.name + ' ' + info.surname + '"' + (this.data.type=='new'?' added':' updated') + ' by '+ this.nome
      this.notif.newNotification(users,str,text ,'','_newcont', '/contacts,{}')
    })
  }

  delete(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: this.oldName, id:this.id, contId:this.contId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        firebase.database().ref('CustContacts').child(result.id).child(result.contId).remove()
        .then(()=>{
          let b = []
          b= this.rigs.filter((d:any)=>{
            return d.custid==this.data.info.custId
          }).map(c=>{return c.sn})
          b.forEach(y=>{
            try{
              firebase.database().ref('shipTo').child(y).child('cont').child(this.data.info.contId).remove()
            } catch{
            }
          })
          this.dialogRef.close('deleted')
        })
        .catch(err=>{console.log('Unable to delete, ' + err)})
      }
    })
  }

  chPos(pos:string):boolean{
    return this.auth.acc(pos)
  }

}
