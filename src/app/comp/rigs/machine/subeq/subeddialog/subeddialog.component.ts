import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { AppupdComponent } from 'src/app/comp/util/dialog/appupd/appupd.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import * as moment from 'moment'
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
  constructor(public dialogRef: MatDialogRef<AppupdComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private auth: AuthServiceService) {
    this.subEqForm = fb.group({
      desc: ['',Validators.required],
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          this.userName=a.Nome + ' ' + a.Cognome
        }
      })
    )
      this.subEqForm.controls.desc.setValue(this.data.itemdesc)
      //this.subEqForm.controls.sn.setValue(this.data.itemsn)
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
      firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child(c).set(e.target.value)
      firebase.database().ref('SubEquipment').child(this.data.rigsn).child(this.data.id).child('modified on ' + moment(new Date()).format('YYYYMMDDHHmmss')).set(
        {by :this.userName, 
          on: new Date(), 
          oldValue:old
        }
      )
    })
    
  }

}
