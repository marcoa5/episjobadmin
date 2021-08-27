import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatFormFieldAppearance } from '@angular/material/form-field'
import firebase from 'firebase/app';

export interface customer{
  id: string,
  c1: string,
  c2: string,
  c3: string
}

@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class NewvisitComponent implements OnInit {
  appearance:MatFormFieldAppearance="fill"
  dateFormGroup: FormGroup | any;
  newCustFormGroup: FormGroup | any;
  custFormGroup: FormGroup | any;
  customers: customer[] |undefined
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').once('value',a=>{
      this.customers=Object.values(a.val())
      this.customers.sort((a, b)=> {
          let varA = a.c1.toLowerCase()
          let varB = b.c1.toLowerCase()
          if (a.c1 < b.c1) {
            return -1;
          }
          if (a.c1 > b.c1) {
            return 1;
          }
          return 0
      })
    })
    .then(()=>{
      
    })

    this.dateFormGroup = this._formBuilder.group({
      date: [new Date(), Validators.required]
    });
    this.newCustFormGroup = this._formBuilder.group({
      ch1: [1]
    })
    this.custFormGroup = this._formBuilder.group({
      c1: ['', Validators.required],
      c2: ['', Validators.required],
      c3: ['', Validators.required],
    });
  }
  a(e:any){
    console.log(e)
    this.custFormGroup.controls.c2.setValue(e.value)

  }

  b(r:string){
    console.log(r)
  }

}
