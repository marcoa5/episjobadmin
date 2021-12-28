import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/app'


export interface el{
  pn: string
  desc: string
  qty: number
}
@Component({
  selector: 'episjob-requestlist',
  templateUrl: './requestlist.component.html',
  styleUrls: ['./requestlist.component.scss']
})
export class RequestlistComponent implements OnInit {
  @Input() sn:string=''
  partList!: MatTableDataSource<el>
  addPart!: FormGroup
  appearance: MatFormFieldAppearance = 'fill'
  displayedColumns:string[]=['ref','pn','desc','qty','del']
  constructor(private fb: FormBuilder) {
    this.addPart = fb.group({
      pn: ['',Validators.required],
      desc: ['',Validators.required],
      qty: ['',Validators.required]
    })
    this.partList = new MatTableDataSource()
   }

  @ViewChild("pn1") pn1!:ElementRef;

  ngOnInit(): void {
    
  }

  ngOnChanges(){
    if(this.sn==''){
      
    }
  }

  newPn(e:any){
    let a= this.addPart.controls.pn.value
    if(a.length==10) {
      firebase.database().ref('PSDParts').child(a).once('value',b=>{
        if(b.val()!=null) {
          let c = this.addPart.controls
          c.desc.setValue(b.val().desc)
          c.desc.disable()
        } else {
          let c = this.addPart.controls
          c.desc.setValue('')
          c.desc.enable()
        }
      })
    } else {
      let c = this.addPart.controls
      c.desc.setValue('')
      c.desc.enable()
      c.qty.setValue('')
    }
  }

  add(){
    let l = this.addPart.controls
    let a = l.pn.value
    let b = l.desc.value
    let c = l.qty.value
    let arr = this.partList.data
    arr.push({pn: a, desc: b, qty:c})
    this.partList.data=arr
    this.addPart.reset()
    l.desc.enable()
    this.pn1.nativeElement.focus()
    console.log(this.partList)
  }

  del(a:number){
    let arr= this.partList.data
    arr.splice(a,1)
    this.partList.data=arr
  }
}
