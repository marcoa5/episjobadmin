import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import firebase from 'firebase/app'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeldialogComponent } from '../deldialog/deldialog.component';

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
  appearance:MatFormFieldAppearance='fill'
  oldName:string=''
  comp:any[]=[]
  constructor(public dialogRef: MatDialogRef<NewcontactComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public fb: FormBuilder, public dialog: MatDialog) {
    console.log(data)
    this.id=data.id? data.id: data.info.id
    this.newCont=fb.group({
      name: ['',Validators.required],
      pos: ['',Validators.required],
      phone: ['',[Validators.required, Validators.pattern]],
      mail: ['',[Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').once('value',a=> {
      a.forEach(b=>{
        if(b.key){
          let com: co={
            id: b.key,
            custName: b.val().c1
          }
          this.comp.push(com)
        }
      })
    })
    .then(()=>console.log(this.comp))

    if(this.data.info!=undefined || this.data.info!=null){
      this.oldName=this.data.info.name
      this.newCont.controls.name.setValue(this.data.info.name)
      this.newCont.controls.pos.setValue(this.data.info.pos)
      this.newCont.controls.phone.setValue(this.data.info.phone)
      this.newCont.controls.mail.setValue(this.data.info.mail)
      
    }
  }

  onNoClick(){
    this.dialogRef.close()
  }

  addContact(){
    let dat={
      name: this.newCont.controls.name.value,
      pos: this.newCont.controls.pos.value,
      phone: this.newCont.controls.phone.value,
      mail: this.newCont.controls.mail.value
    }
    firebase.database().ref('Contacts').child(this.id).child(this.newCont.controls.name.value).set(dat)
    .then(()=>{
      this.dialogRef.close('created')
    })
    if(this.oldName!='' && this.oldName!=this.newCont.controls.name.value) {
      firebase.database().ref('Contacts').child(this.id).child(this.oldName).remove()
    }
  }

  delete(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: this.oldName, id:this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        firebase.database().ref('Contacts').child(result.id).child(result.name).remove()
        .then(()=>this.dialogRef.close('deleted'))
        .catch(err=>{console.log('Unable to delete, ' + err)})
        
      }
    })
  }

}
