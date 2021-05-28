import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Location } from '@angular/common'

export interface cl {
  c1: any
  c2: any
  c3: any
}

@Component({
  selector: 'episjob-newcust',
  templateUrl: './newcust.component.html',
  styleUrls: ['./newcust.component.scss']
})
export class NewcustComponent implements OnInit {
  @Output() dati = new EventEmitter<string>()
  newC:FormGroup;
  appearance:MatFormFieldAppearance="fill"
  constructor(private fb:FormBuilder, private location:Location) {
    this.newC = fb.group({
      name:['1',[Validators.required]],
      address1: ['2',[Validators.required]],
      address2: ['3',[Validators.required]],
    })
   }

  ngOnInit(): void {
    
  }

  add(a:FormGroup){
    let g:cl ={
      c1: a.get('name')?.value,
      c2: a.get('address1')?.value,
      c3:a.get('address2')?.value
    }
    this.location.back()
  }

}
