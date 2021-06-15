import { Component, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import firebase from 'firebase'
@Component({
  selector: 'episjob-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {
  appearance:MatFormFieldAppearance='fill'
  seg:FormGroup
  bls:string[]=[
    'Surface','Underground'
  ]
  family:string[]=[
    'CrushingScreening',
    'Cutting',    
    'Drilling',
    'Exploration',
    'Material Handling'
  ]
  segments:string[]=[
    'Construction',
    'Exploration',
    'Mining',
    'Quarry',
    'Recycling'
  ]
  categ:string[]=[
    'Bolting',
    'Continuous Loader',
    'Coprod',
    'Crusher',
    'DSI',
    'DTH',
    'Face Drilling',
    'Grouting',
    'Loader',
    'Locomotive',
    'Pneumatic TH',
    'Production Drilling',
    'RBM',
    'Screener',
    'TH',
    'Truck',
    'Underground Exploration'
  ]
  constructor(private fb: FormBuilder) {
    this.seg = fb.group({
      div: ['',[Validators.required]],
      fam: ['',[Validators.required]],
      seg: ['',[Validators.required]],
      subC: ['',[Validators.required]],
    })
   }

  ngOnInit(): void {
  }

}
