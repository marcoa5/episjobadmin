import { Component, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import firebase from 'firebase'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router'


@Component({
  selector: 'episjob-newtech',
  templateUrl: './newtech.component.html',
  styleUrls: ['./newtech.component.scss']
})
export class NewtechComponent implements OnInit {
  appearance:MatFormFieldAppearance="fill"
  addUpd:boolean = true
  newT:FormGroup;
  pos:string|undefined
  origName:string|undefined
  constructor(private fb:FormBuilder, private router:Router, private route:ActivatedRoute) { 
    this.newT = fb.group({
      fn:['', [Validators.required]],
      sn:['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
      })
    })
    this.route.params.subscribe(a=>{
      if(a) {
        this.newT = this.fb.group({
          fn:[a.fn, [Validators.required]],
          sn: [a.sn, [Validators.required]],
        })
        this.addUpd = false
        this.origName = a.fn
      }
    })
  }

  datiC(a:FormGroup){
    let g = [a.get('sn')?.value,a.get('model')?.value, a.get('customer')?.value]
    return g
  }

  add(a:any,b:FormGroup){
    let g:string[] = [b.get('fn')?.value,b.get('sn')?.value]
    if(a=='addt' && this.pos=='SU'){
      firebase.database().ref('Tech/' + g[0].toUpperCase()).set({
        s: g[1].toUpperCase(),
      }).then(()=>{
        this.router.navigate(['technicians'])
      })
      
    }
    if(a=='updt' && this.pos=='SU'){
      firebase.database().ref('Tech/' + this.origName).remove()
      .then(()=>{
        firebase.database().ref('Tech/' + g[0].toUpperCase()).set({
          s: g[1].toUpperCase(),
        })
        .then(()=>{
          this.router.navigate(['technicians'])
        })
      })
      
      
    }
  }
}
