import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import firebase from 'firebase/app'
import { MatDialogRef} from '@angular/material/dialog'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { unescapeIdentifier } from '@angular/compiler';

@Component({
  selector: 'episjob-newpartsrequest',
  templateUrl: './newpartsrequest.component.html',
  styleUrls: ['./newpartsrequest.component.scss']
})
export class NewpartsrequestComponent implements OnInit {
  newRequest!: FormGroup
  type: any
  appearance: MatFormFieldAppearance = 'fill'
  rigs:any[]=[]
  _rigs:any[]=[]
  chStr:boolean=true
  details:any[]=[]
  pos:string=''
  technicians:any[]=[]
  subsList:Subscription[]=[]
  tech:any
  nome:string=''
  tId:string=''
  @Output() sn=new EventEmitter()
  
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<NewpartsrequestComponent>, public auth:AuthServiceService) {
    this.newRequest = fb.group({
      search: ['']
    })
   }

  @ViewChild('sea') sea1!: ElementRef
  
  ngOnInit(): void {
    this.technicians=[]
    this.tech=undefined
    this.subsList.push(
      this.auth._fleet.subscribe(a=>{this._rigs=a; this.rigs=a}),
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.nome=a.Nome + ' ' + a.Cognome
        this.tId=a.uid
      })
    )
    if(this.pos=='SU' || this.pos=='admin'){
      firebase.database().ref('Users').once('value',a=>{
        a.forEach(b=>{
          this.technicians.push({name: b.val().Nome + ' ' + b.val().Cognome, id:b.key})
        })
      })
    } else{
      this.technicians=[]
      this.technicians.push({name: this.nome, id:this.tId})
      this.tech=this.nome
    }
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(){
    let f=this.newRequest.controls.search.value
    if(f.length>2) {
      this.chStr=true
      this.details=[]
      this.sn.emit('')
    }
    if(f.length>2){
      this.rigs=this.rigs.filter(a=>{
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
    let b: string=''
    firebase.database().ref('Users').child(this.tech).once('value',a=>{
      b=a.val().Nome + ' ' + a.val().Cognome
    })
    .then(()=>{
      this.dialogRef.close({sn: a[0].value, model: a[1].value, customer: a[2].value, type: this.type, origId: this.tech, orig:b, author: this.nome})
    })
    
  }
}
