import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { AppupdComponent } from 'src/app/comp/util/dialog/appupd/appupd.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import * as moment from 'moment'
import { MakeidService } from 'src/app/serv/makeid.service';
import { DeldialogComponent } from 'src/app/comp/util/dialog/deldialog/deldialog.component';
import { NewsubeqComponent } from '../newsubeq/newsubeq.component';
@Component({
  selector: 'episjob-subeddialog',
  templateUrl: './subeddialog.component.html',
  styleUrls: ['./subeddialog.component.scss']
})
export class SubeddialogComponent implements OnInit {
  subEqForm!:FormGroup
  pos:string=''
  userName:string=''
  subsList:Subscription[]=[]
  constructor(public dialogRef: MatDialogRef<AppupdComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private auth: AuthServiceService, private makeid: MakeidService, private dialog: MatDialog) {
    this.subEqForm = fb.group({
      desc: ['',Validators.required],
    })
  }

  ngOnInit(): void {
    if(this.data.id==undefined) this.data.id = this.makeid.makeId(5)
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          this.userName=a.Nome + ' ' + a.Cognome
        }
      })
    )
      this.subEqForm.controls.desc.setValue(this.data.itemdesc)
      if(this.data.itemsn!='') {
        this.subEqForm.addControl('sn',new FormControl(''))
        this.subEqForm.controls.sn.setValue(this.data.itemsn)
      }
      if(this.data.cat=='Rock Drill'){
        this.subEqForm.addControl('shank',new FormControl(''))
        this.subEqForm.addControl('ext',new FormControl(''))
        this.subEqForm.addControl('motor',new FormControl(''))
        this.subEqForm.controls.shank.setValue(this.data.shank)
        this.subEqForm.controls.ext.setValue(this.data.ext)
        this.subEqForm.controls.motor.setValue(this.data.motor)
      }
    this.disable()
  }

  disable(){
    if(this.pos!='SU' && this.pos!='admin'){
      this.subEqForm.disable()
    }
  }

  upd(e:any, c:string){
    let old:string=''
    firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child(c).once('value',a=>{
      if(a.val()) old= a.val()
    })
    .then(()=>{
      if(old!=e.target.value){
        firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child(c).set(e.target.value)
        firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child('cat').set(this.data.cat)
        firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child('sn').set(this.data.rigsn)
        firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child('modified on ' + moment(new Date()).format('YYYYMMDDHHmmss')).set(
          {by :this.userName, 
            on: new Date(), 
            oldValue:old
          }
        )
      }
    })
  }

  onNoClick(){
    this.dialogRef.close()
  }

  delete(){
    const di = this.dialog.open(DeldialogComponent, {data:{name: this.data.cat, itemsn:this.data.id}})
    di.afterClosed().subscribe(a=>{
      if(a){
        firebase.database().ref('SubEquipment').child(this.data.rigsn).child(a).remove()
        this.dialogRef.close()
      }
      
    })
  }

  transfer(){
    const tra=this.dialog.open(NewsubeqComponent,  {data:{transfer:true, info:this.data}})
    tra.afterClosed().subscribe(a=>{
      if(a){
        let r = a[0]
        r['transfer']={}
        r.transfer[moment(new Date()).format('YYYYMMDDHHmmss')]={from: a[0].rigsn}
        firebase.database().ref('SubEquipment').child(a[1]).child(a[0].id).set(a[0]).then(()=>{
          firebase.database().ref('SubEquipment').child(a[0].sn).child(a[0].id).remove()
          .catch((error)=>console.log(error))
          this.dialogRef.close()
        })
        .catch((error)=>console.log(error))
      }
    })
  }
}
