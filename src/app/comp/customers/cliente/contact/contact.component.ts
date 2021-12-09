import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'episjob-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  newItem:boolean|undefined
  rou:any
  pos:string|undefined
  custForm:FormGroup
  appearance:MatFormFieldAppearance='fill'
  constructor(private route: ActivatedRoute, fb: FormBuilder) {
    this.custForm = fb.group({
      'name' : ['',Validators.required],
      'pos' : ['',Validators.required],
      'phone' : ['',Validators.required],
      'mail' : ['',[Validators.required, Validators.email]],
    })
   }

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a.id=='new') this.newItem=true
      if(a.id=='upd') this.newItem=false
      if(a.custId) this.rou=['cliente',{id: a.custId}]
    })
    firebase.auth().onAuthStateChanged(a=>{
      if(a?.uid) firebase.database().ref('Users').child(a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
    })
  }

  checkD(): boolean{
    if(this.custForm.invalid) return false
    return true
  }


}
