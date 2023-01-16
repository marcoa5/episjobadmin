import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { relativeTimeThreshold } from 'moment';

@Component({
  selector: 'episjob-consuntivo',
  templateUrl: './consuntivo.component.html',
  styleUrls: ['./consuntivo.component.scss']
})
export class ConsuntivoComponent implements OnInit {
  keys:any[]=[]
  items:any[]=[]
  con:any[]=[]
  it:any[]=[]
  mask!:FormGroup
  constructor(private fb:FormBuilder, private dialogRef:MatDialogRef<ConsuntivoComponent,any>,@Inject(MAT_DIALOG_DATA) public data:any) {
    this.mask= fb.group({})
  }

  ngOnInit(): void {
    this.keys= Object.keys(this.data).filter(o=>{return o!='items'})
    this.items = Object.keys(this.data.items)
    for(let r=this.items.length+1;r<=20;r++){
      this.items.push(r.toString())
    }
    let index:number=1
    this.keys.forEach(k=>{
      this.mask.addControl(k,new FormControl(this.data[k]))
      if(index<=3){
        this.con.push({name: k,row:'a'+index,val: this.data[k]})
      } else if(index>=4 && index<=7){
        this.con.push({name: k,row:'a'+index,val: this.data[k]})
      } else if(index>=8 && index<=10){
        this.con.push({name: k,row:'a'+index,val: this.data[k]})
      } else {
        this.con.push({name: k,row:'a'+index,val: this.data[k]})
      }
      index++
    })
    let itemin:number = 0
    this.setItems()
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  setItems(){
    console.log(this.items)
    this.items.forEach(i=>{
      let pi = i -1
      this.mask.addControl('it' + pi,new FormControl(this.data.items[i]?this.data.items[i].item:''))
      this.mask.addControl('pn' + pi,new FormControl(this.data.items[i]?this.data.items[i].pn:''))
      this.mask.addControl('llp' + pi,new FormControl(this.data.items[i]?this.data.items[i].llp:'',Validators.pattern('^[0-9]*\.[0-9][0-9]$')))
      this.mask.addControl('qty' + pi,new FormControl(this.data.items[i]?this.data.items[i].qty:'',Validators.pattern('[0-9]')))
      this.mask.addControl('disc' + pi,new FormControl(''))
      this.mask.addControl('tra' + pi,new FormControl(''))
      this.it.push(this.data.items[i])
    })
  }

  addItem(){
    this.items.push({123:{}})
  }

  send(){
    this.dialogRef.close('go')
  }
}
