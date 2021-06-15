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
  }

  ch(a: FormGroup){
    let b = [a.get('div')?.value,a.get('fam')?.value,a.get('segm')?.value,a.get('subC')?.value]
    let g = {
      div: a.get('div')?.value,
      fam: a.get('fam')?.value,
      segment:a.get('segm')?.value,
      subCat: a.get('subC')?.value
    }

    if(b.includes('')){
      this.check.emit([0, g]) 
    } else{
      this.check.emit([1, g])
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
