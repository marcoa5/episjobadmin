import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/app'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';


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
  @Output() send=new EventEmitter()
  partList!: MatTableDataSource<el>
  addPart!: FormGroup
  appearance: MatFormFieldAppearance = 'fill'
  displayedColumns:string[]=['ref','pn','desc','qty','del']
  chPn:boolean= false

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.addPart = fb.group({
      pn: ['',Validators.required],
      desc: ['',Validators.required],
      qty: ['',Validators.required]
    })
    this.addPart.controls.desc.disable()
    this.addPart.controls.qty.disable()
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
          this.chPn=true
          c.desc.disable()
          c.qty.enable()
        } else {
          let c = this.addPart.controls
          c.desc.setValue('')
          c.desc.enable()
          c.qty.enable()
        }
      })
    } else {
      let c = this.addPart.controls
      c.desc.setValue('')
      c.desc.disable()
      c.qty.disable()
      c.qty.setValue('')
      this.chPn=false
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
    l.desc.disable()
    l.qty.disable()
    this.pn1.nativeElement.focus()

  }

  del(a:number){
    const dialogRef=this.dialog.open(DeldialogComponent,{data: {desc: this.partList.data[a].pn, id:'0'}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let arr= this.partList.data
        arr.splice(a,1)
        this.partList.data=arr
      }
      this.pn1.nativeElement.focus()
    })
  }

  submit(){
    this.send.emit(this.partList.data)
  }
}
