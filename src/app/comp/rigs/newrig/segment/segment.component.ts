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
  @Output() data = new EventEmitter()
  @Input() values: any
  appearance:MatFormFieldAppearance='fill'
  con:string='s'
  seg:FormGroup

  info:any={
    Surface:{
      CrushingScreening:['Crusher','Screener'],
      Cutting:['DSI'],
      Drilling:['Coprod','DSI','DTH', 'Pneumatic TH', 'TH'],
      Exploration: ['Surface Exploration']
    },
    Underground: {
      Drilling:['Bolting','Face Drilling','Production Drilling','RBM',],
      Exploration:['Underground Exploration'],
      MaterialHandling:['Continuous Loader','Loader','Locomotive','Truck'],
      Electrification:['Charger'],
    }
  }
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
    'Electrification',
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
    'Charger',
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
    'Underground Exploration',
    
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
      this.data.emit(a)
    }
  }

  divCh(){
    if(this.seg!=undefined && this.seg.get('div')?.value=='Surface'){
      this.con= 's'
    } else {
      this.con= 'u'
    }    
  }

  step(e:any){
    //console.log(this.seg.controls.fam.value)
    //console.log(this.info[e.source.ngControl.value][this.seg.controls.fam.value])
    let n = e.source.ngControl.name
    switch(n){
      case 'div':
        this.seg.controls.fam.setValue('')
        this.seg.controls.subC.setValue('')
        this.seg.controls.segm.setValue('')
        this.family=Object.keys(this.info[e.source.ngControl.value])
        break
      case 'fam':
        this.seg.controls.subC.setValue('')
        this.seg.controls.segm.setValue('')
        this.categ=Object.values(this.info[this.seg.controls.div.value][e.source.ngControl.value])
        break
      case 'subC':
        this.seg.controls.segm.setValue('')
    }
  }

}
