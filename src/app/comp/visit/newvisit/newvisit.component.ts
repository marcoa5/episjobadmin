import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-newvisit',
  templateUrl: './newvisit.component.html',
  styleUrls: ['./newvisit.component.scss']
})
export class NewvisitComponent implements OnInit {
  newV: FormGroup;
  appearance:MatFormFieldAppearance="fill"
  customers: string[]=[]
  filteredOptions: Observable<string[]>|undefined
  enCustAd:boolean = false
  constructor(private fb: FormBuilder) {
    this.newV = fb.group({
      date: new FormControl(Validators.required),
      cust1: new FormControl(Validators.required),
      cust2: new FormControl(Validators.required),
      cust3: new FormControl(Validators.required),
    })
  }

  ngOnInit(): void {
    firebase.database().ref('CustomerC').once('value',d=>{
      d.forEach(r=>{this.customers.push(r.val().c1)})
    })
    .then(()=>this.customers.sort())
    this.newV.controls.date.setValue(new Date())
    this.newV.controls.cust1.setValue('')
    this.newV.controls.cust2.setValue('')
    this.newV.controls.cust3.setValue('')

    this.filteredOptions = this.newV.controls.cust1.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(option => option.toLowerCase().includes(filterValue));
  }

  enCust(): boolean{
    if(this.newV.controls.date.value!=null) return true
    return false
  }

  chg(e:any){
      firebase.database().ref('CustomerC').orderByChild('c1').equalTo(e.value).once('value', s=>{
      if(s.val()){
        let yt = JSON.stringify(Object.values(s.val())[0])
        let gg = JSON.parse(yt)      
        this.newV.controls.cust2.setValue(gg.c2)
        this.newV.controls.cust3.setValue(gg.c3)
        this.newV.controls.cust2.disable()
        this.newV.controls.cust3.disable()
      } else {
        this.newV.controls.cust2.setValue('')
        this.newV.controls.cust3.setValue('')
        this.newV.controls.cust2.enable()
        this.newV.controls.cust3.enable()
      }
    })
  }

}
