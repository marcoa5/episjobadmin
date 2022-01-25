import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import firebase from 'firebase/app'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { Router } from '@angular/router'
import { InputhrsComponent } from '../../util/dialog/inputhrs/inputhrs.component';
import { ImportpartsComponent } from '../../util/dialog/importparts/importparts.component';
import * as moment from 'moment'
import { GetquarterService } from 'src/app/serv/getquarter.service';

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
  @Input() listP: any[]=[]
  @Output() send=new EventEmitter()
  @Output() list=new EventEmitter()
  @Output() clear= new EventEmitter()

  partList!: MatTableDataSource<el>
  addPart!: FormGroup
  appearance: MatFormFieldAppearance = 'fill'
  displayedColumns:string[]=['ref','pn','desc','qty','del']
  chPn:boolean= false

  constructor(private quarter: GetquarterService, private fb: FormBuilder, public dialog: MatDialog, public router: Router) {
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
    if(this.listP && this.listP.length>0){
      this.partList.data=this.listP
      setTimeout(() => {
        this.pn1.nativeElement.focus()
      }, 150);
    }
  }

  newPn(e:any){
    let a= ''
    if(e.target.value) a=e.target.value.toString()
    if(a.length==10) {
      firebase.database().ref('PSDItems').child(this.quarter.getQ()).child(a).once('value',b=>{
        if(b.val()!=null) {
          let c = this.addPart.controls
          c.desc.setValue(b.val().desc)
          this.chPn=true
          c.desc.enable()
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
    let a = ('0000000000' + l.pn.value).slice(-10)
    let b = l.desc.value
    let c = l.qty.value
    let arr = this.partList.data
    arr.push({pn: a, desc: b, qty:c})
    this.partList.data=arr
    this.list.emit(this.partList.data)
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
        this.list.emit(this.partList.data)
      }
      this.pn1.nativeElement.focus()
    })
  }

  submit(){
    this.send.emit(this.partList.data)
  }

  back(){
    this.clear.emit('clear')
  }

  upd(a:number,b:string,c:string){
    console.log(a,b, this.partList.data)
    const dialogRef=this.dialog.open(InputhrsComponent,{data: {hr: b}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let y:any= this.partList.data[a]
        y[c]=result
        this.list.emit(this.partList.data)
      }
    })
  }

  import(){
    const dialogRef=this.dialog.open(ImportpartsComponent)
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        let a:string[] = result.split('\n')
        let templist:el[]=[]
        let cherr:boolean=false
        a.forEach(b=>{
          let c= b.split('\t')
          if(c.length>2 && c[0].length==10 && c[1]!='' && !isNaN(parseInt(c[2]))) {
            if(c[3]){
              templist.push({pn: ('0000000000'+c[0]).slice(-10),desc:c[1] + ' (replace ' + ('0000000000'+c[3]).slice(-10) +')',qty:parseInt(c[2])})
            } else {
              templist.push({pn: ('0000000000'+c[0]).slice(-10),desc:c[1],qty:parseInt(c[2])})
            }
          } else if(c.length==1){}
          else{
            cherr=true
          }
        })
        setTimeout(() => {
          if(!cherr) {
            this.partList.data=templist
            this.list.emit(this.partList.data)
          } else {
            alert('Wrong data format')
          }
        }, 100);
      }
    })
  }

  clearL(){
    const dialogRef=this.dialog.open(DeldialogComponent,{data:{name:'list'}})
    dialogRef.afterClosed().subscribe(result=>{
      if(result!=undefined){
        this.partList.data=[]
        this.list.emit(this.partList.data)
      }
    })
  }
}



