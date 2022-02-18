import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import firebase from 'firebase/app';

@Component({
  selector: 'episjob-sjemail',
  templateUrl: './sjemail.component.html',
  styleUrls: ['./sjemail.component.scss']
})
export class SjemailComponent implements OnInit {
  @Input() id:string=''
  @Input() mail:string=''
  @Input() disabled:boolean=false
  email!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  emailList:string[]=[]
  @ViewChild('nm') nm!:ElementRef
  @Output() listOfEmail = new EventEmitter()
  options: string[] = [];
  filteredOptions!: Observable<string[]>;

  constructor(private fb: FormBuilder) { 
    this.email=fb.group({
      newmail: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
    if(this.disabled) this.email.controls.newmail.disable()
    if(this.mail) {
      this.emailList = this.mail.split(';')
    }
    this.startAutoComplete()
  }

  startAutoComplete(){
    if(this.id && this.id!='' && navigator.onLine) {
      firebase.database().ref('Contacts').child(this.id).once('value',a=>{
        this.options=[]
        a.forEach(b=>{
          this.options.push(b.val().mail)
        })
      }).then(()=>{
        this.filteredOptions = this.email.controls.newmail.valueChanges.pipe(
          startWith(''),
          map(value => (value? this._filter(value) : this.options.slice())),
        );
      })
    }
  }

  displayFn(value:any): string {
    return value ? value : '';
  }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  disBut(){
    let a = this.email.controls.newmail
    return a.invalid
  }

  addMail(){
    let a = this.email.controls.newmail
    if(!this.emailList.includes(a.value)) {
      this.emailList.push(a.value)
    }
    this.email.reset()
    this.startAutoComplete()
    this.nm.nativeElement.focus()
    this.listOfEmail.emit(this.emailList.join(';'))
  }

  remove(e:any){
    this.emailList.splice(this.emailList.indexOf(e),1)
    this.listOfEmail.emit(this.emailList.join(';'))
  }

  
}
