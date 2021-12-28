import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import firebase from 'firebase/app'
import { MatDialogRef} from '@angular/material/dialog'

@Component({
  selector: 'episjob-newpartsrequest',
  templateUrl: './newpartsrequest.component.html',
  styleUrls: ['./newpartsrequest.component.scss']
})
export class NewpartsrequestComponent implements OnInit {
  newRequest!: FormGroup
  type!: FormGroup
  appearance: MatFormFieldAppearance = 'fill'
  rigs:any[]=[]
  _rigs:any[]=[]
  chStr:boolean=true
  details:any[]=[]
  @Output() sn=new EventEmitter()
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<NewpartsrequestComponent>) {
    this.newRequest = fb.group({
      search: ['']
    })
    this.type=fb.group({
      ty: ['',Validators.required]
    })
   }

  @ViewChild('sea') sea1!: ElementRef
  
  ngOnInit(): void {
    firebase.database().ref('MOL').once('value',a=>{
      if(a.val()!=null){
        this._rigs=Object.values(a.val())
      }
    })
    .then(()=>{
      this.rigs=this._rigs
    })
  }

  

  filter(){
    let f=this.newRequest.controls.search.value
    if(f.length>2) {
      this.chStr=true
      this.details=[]
      this.sn.emit('')
    }
    if(f.length>2){
      this.rigs=this._rigs.filter(a=>{
        if(a.sn.toLowerCase().includes(f.toLowerCase()) || a.model.toLowerCase().includes(f.toLowerCase()) || a.customer.toLowerCase().includes(f.toLowerCase())) return true
        return false
      }) 
    } else {
      this.rigs= this._rigs
    }
  }

  sel(a:any){
    this.chStr=false
    this.details=[
      {value: a.sn, lab: 'Serial nr.', click:'', url:''},
      {value: a.model, lab: 'Model', click:'', url:''},
      {value: a.customer, lab: 'Customer', click:'', url:''},
    ]
    this.sn.emit(a.sn)
  }

  rem(){
    this.newRequest.controls.search.setValue('')
    this.details=[]
    this.chStr=true
    this.rigs=this._rigs
    this.sn.emit('')
    setTimeout(() => {
      this.sea1.nativeElement.focus()
    }, 20);
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  go(){
    let a = this.details
    this.dialogRef.close({sn: a[0].value, model: a[1].value, customer: a[2].value, type: this.type.controls.ty.value})
  }
}
