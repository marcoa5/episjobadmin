import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import firebase from 'firebase/app'
import { MakeidService } from 'src/app/serv/makeid.service';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'episjob-newfile',
  templateUrl: './newfile.component.html',
  styleUrls: ['./newfile.component.scss']
})
export class NewfileComponent implements OnInit {
  details:any|undefined
  rigData!:FormGroup
  
  workshops:any[]=environment.workshops
  types:any[]=[
    {val:"H", desc: "H - HAT"},
    {val:"L", desc: "L - LHD"},
    {val:"M", desc: "M - MRS"},
    {val:"R", desc: "R - RDT"},
    {val:"S", desc: "S - SED"},
    {val:"U", desc: "U - URE"},
    {val:"V", desc: "V - VERNIA"},
  ]
  constructor(private dialogRef:MatDialogRef<NewfileComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb:FormBuilder, private makeid:MakeidService) {
    this.rigData=this.fb.group({
      file: ['',Validators.required],
      model: ['',Validators.required],
      customer: ['',Validators.required],
      custid: ['',Validators.required],
      sn: ['',Validators.required],
      id: [this.makeid.makeId(6),Validators.required],
      type:['',Validators.required],
      sj: ['',Validators.required],
      ws: ['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  sel(){
    
  }

  dat(e:any){
    this.details=undefined
    if(e!='' && e!=undefined) {
      this.details=e
      if(e.model=='Component') {
        this.rigData.controls.file.setValue(`${this.rigData.controls.type.value} Component`)
      } else {
        this.rigData.controls.file.setValue(`${this.rigData.controls.type.value} ${e.sn}`)
      }

      this.rigData.controls.sn.setValue(e.sn)
      this.rigData.controls.model.setValue(e.model)
      this.rigData.controls.customer.setValue(e.customer)
      this.rigData.controls.custid.setValue(e.custid)
    }
  }

  save(a:any){
    a.hrs=0
    let serial:string=''
    if(a.sn!='Component'){
      serial=a.sn
    } else {
      serial='Component' + this.makeid.makeId(5)
    }
    firebase.database().ref('wsFiles').child('open').child(serial).child(a.id).set(a)
    this.dialogRef.close(a)
  }

  editFileName(){
    if(this.rigData.controls.sn.value.toLowerCase()=='component'){
      this.rigData.controls.file.setValue(`${this.rigData.controls.type.value} ${this.rigData.controls.model.value}`)
    }
  }
}
