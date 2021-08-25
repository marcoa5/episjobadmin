import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import {Observable, from} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'episjob-visitfield',
  templateUrl: './visitfield.component.html',
  styleUrls: ['./visitfield.component.scss']
})
export class VisitfieldComponent implements OnInit {
  @Input() label:string|undefined
  @Input() type:string|undefined
  @Input() array:string[]=[]
  @Input() placeholder:string=''
  @Output() output = new EventEmitter()
  @Input() val:string|undefined
  @Input() dis:boolean|undefined
  @Input() req:boolean=true
  filteredOptions: Observable<string[]>|undefined

  appearance: MatFormFieldAppearance='fill'
  form: FormGroup
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      field : new FormControl()
    })
   }

  ngOnInit(): void { 
    if(this.req) this.form.controls.field.setValidators(Validators.required)
    this.form.controls.field.valueChanges.subscribe((a)=>{
      this.send()
    })
  }

  ngOnChanges(): void { 
    this.filteredOptions = this.form.controls.field.valueChanges.pipe(startWith(''), map(value => this._filter(value)))  
    if(this.dis==true) {this.form.controls.field.disable()} else {this.form.controls.field.enable()}
    if(this.val!=undefined) {
      this.form.controls.field.setValue(this.val)
      this.send()
    }

  }


  private _filter(value: string): string[] {
    let filterValue:string
    if(value) filterValue = value.toLowerCase();
    if(this.array.length>0) return this.array.filter(option => option.toLowerCase().includes(filterValue));
    return this.array
  }

  send(){
    this.output.emit(this.form.controls.field.value)
  }


}
