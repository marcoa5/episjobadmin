import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/database'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'

export interface fam{
  bl?: string
  fam?:string
}

@Component({
  selector: 'episjob-potential',
  templateUrl: './potential.component.html',
  styleUrls: ['./potential.component.scss']
})


export class PotentialComponent implements OnInit {
  families:any[]=[]
  ttmPot!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  constructor(private fb:FormBuilder) {
    this.ttmPot = fb.group({})
  }

  ngOnInit(): void {
    firebase.database().ref('ttmFam').once('value',a=>{
      if(a.val()!=null) a.forEach(b=>{
        Object.values(b.val()).forEach(c=>{
          this.families.push(c)
        })
      })
    })
    .then(()=>{
      let i:number=1
      this.families.map(a=>{
        
      })
      console.log(this.ttmPot)
    })
  }

}
