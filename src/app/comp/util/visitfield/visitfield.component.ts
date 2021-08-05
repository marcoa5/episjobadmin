import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() title:string|undefined
  @Input() label:string|undefined
  @Input() type:string|undefined
  @Input() array:string[]=[]
  @Output() output = new EventEmitter()
  filteredOptions: Observable<string[]>|undefined

  appearance: MatFormFieldAppearance='fill'
  form: FormGroup
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      field : new FormControl('',Validators.required)
    })
   }

  ngOnInit(): void { 
    setTimeout(() => {
      if(this.array.length>0) {
        this.filteredOptions = this.form.controls.field.valueChanges.pipe(startWith(''), map(value => this._filter(value)))  
      } 
    }, 100);
            
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.array.filter(option => option.toLowerCase().includes(filterValue));
  }

  send(){
    if(!this.form.controls.field.invalid) this.output.emit(this.form.controls.field.value)
  }

  ok(){
    console.log(this.array)
  }

}
