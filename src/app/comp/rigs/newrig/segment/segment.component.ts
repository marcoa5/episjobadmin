import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import firebase from 'firebase'
@Component({
  selector: 'episjob-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {
  @Output() check = new EventEmitter()
  @Input() values: any
  appearance:MatFormFieldAppearance='fill'
  con:string='s'
  seg:FormGroup
  bls:string[]=[
    'Surface',
    'Underground'
  ]
  family:any[]=[
    'CrushingScreening',
    'Cutting',
    'Drilling',
    'Exploration',
    'Material Handling',
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
      segm: ['',[Validators.required]],
      subC: ['',[Validators.required]],
    })
   }

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    if(this.values[0]) {
      this.seg.get('div')?.setValue(this.values[0].div)
      this.seg.get('fam')?.setValue(this.values[0].fam)
      this.seg.get('subC')?.setValue(this.values[0].subCat)
      this.seg.get('segm')?.setValue(this.values[0].segment)
    }
    this.ch(this.seg)
  }

  ch(a: FormGroup){
    if(a.invalid) {
      this.check.emit(true)
    } else {
      this.check.emit(false)
    }
  }

  divCh(){
    if(this.seg!=undefined && this.seg.get('div')?.value=='Surface'){
      this.con= 's'
    } else {
      this.con= 'u'
    }    
  }

}
