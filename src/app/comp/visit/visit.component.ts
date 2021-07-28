import { Component, OnInit } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormGroup, FormBuilder, Validators, Form, FormControl } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import firebase from 'firebase/app';
import 'firebase/database'
import { from,Observable } from 'rxjs'
import {map, observeOn, startWith} from 'rxjs/operators';

@Component({
  selector: 'episjob-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  input:FormGroup
  cust = new FormControl();
  data:any
  oggi:any
  customers: string[]=[]
  filteredOptions: Observable<any[]> | undefined;
  appearance:MatFormFieldAppearance='fill'
  icon:boolean=false
  con:string[]=[]
  contacts: Observable<any[]> | undefined;
  constructor(private fb: FormBuilder) {
    this.oggi=new Date()

    this.input = fb.group({
      data: new FormControl({value: this.oggi, disabled: false}, Validators.required),
      cust: new FormControl({value: '', disabled: false}, Validators.required),
      ad1: new FormControl({value: '', disabled: false}, Validators.required),
      ad2: new FormControl({value: '', disabled: false}, Validators.required),
      c2: new FormControl({value: '', disabled: false}, Validators.required),
      c3: new FormControl({value: '', disabled: false}, Validators.required),
      name: new FormControl({value: '', disabled: false}, Validators.required),
      role: new FormControl({value: '', disabled: false}, Validators.required),
      phone: new FormControl({value: '', disabled: false}, Validators.required),
      mail: new FormControl({value: '', disabled: false}, Validators.required),
    })
  }

  ngOnInit(): void {
    
    firebase.database().ref('CustomerC').once('value',a=>{
      a.forEach(b=>{this.customers.push(b.val().c1)})
    })
    .then(()=>{
      this.customers.sort()
      this.con = ['a','b','c','d','e','f']
      this.filteredOptions = this.input.controls.cust.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.contacts=this.input.controls.name.valueChanges.pipe(
        startWith(''),
        map(value => this._filterN(value))
      )
    })
    
  }
   
  ok(a:any){
    console.log(this.input.controls.data.value)
  }

  chg(e:any){
    let nome:string = e.value.toUpperCase()
    if (nome!=null || nome!=undefined || nome!='') {
      firebase.database().ref('CustomerC').orderByChild('c1').equalTo(nome).once('value',n=>{
        if (n.val()!=null) {
          n.forEach(m=>{
            this.input.controls.c2.setValue(m.val().c2)
            this.input.controls.c3.setValue(m.val().c3)
            this.input.controls.c2.disable()
            this.input.controls.c3.disable()
            this.icon=true
          })
        } else {
          this.input.controls.c2.setValue('')
          this.input.controls.c3.setValue('')
          this.input.controls.c2.enable()
          this.input.controls.c3.enable()
          this.icon=false
        }
      })
    }
  }

  chgCon(e:any){

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterN(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.con.filter(option => option.toLowerCase().includes(filterValue));
  }

  size(){
    if(window.innerWidth>600) return 35
    return 10
  }

  g(): boolean{
    if(this.input.controls.name.value!='')return true
    return false
  }

  f(){
    if(this.input.controls.cust.value!='') return true
    return false
  }
}
