import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { machineLearning } from 'firebase-admin';
import firebase from 'firebase/app';
import { GetPotYearService } from 'src/app/serv/get-pot-year.service';
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { ImportpartsComponent } from '../importparts/importparts.component';

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
  constructor(private getQ:GetquarterService, private dialog:MatDialog, private fb:FormBuilder, private dialogRef:MatDialogRef<ConsuntivoComponent,any>,@Inject(MAT_DIALOG_DATA) public data:any, private quarter:GetquarterService) {
    this.mask= fb.group({})
  }

  ngOnInit(): void {
    this.keys= Object.keys(this.data.data)    
    let index:number=1
    for(let r=1;r<=20;r++){
      this.items.push({name: '_pnr'+r,row:'r'+r, col:'c'+1,val: ''})
      this.mask.addControl('_pnr'+r,new FormControl(''))
      this.items.push({name: '_ite'+r,row:'r'+r, col:'c'+2,val: ''})
      this.mask.addControl('_ite'+r,new FormControl(''))
      this.items.push({name: '_llp'+r,row:'r'+r, col:'c'+3,val: ''})
      this.mask.addControl('_llp'+r,new FormControl(''))
      this.items.push({name: '_qty'+r,row:'r'+r, col:'c'+4,val: ''})
      this.mask.addControl('_qty'+r,new FormControl(''))
      this.items.push({name: '_dis'+r,row:'r'+r, col:'c'+5,val: ''})
      this.mask.addControl('_dis'+r,new FormControl(''))
      this.items.push({name: '_tra'+r,row:'r'+r, col:'c'+6,val: ''})
      this.mask.addControl('_tra'+r,new FormControl(''))
    }
    this.keys.forEach(k=>{
      if(k.substring(0,1)!='_'){
        this.mask.addControl(k,new FormControl(this.data.data[k]))
        if(index<=3){
          this.con.push({name: k,row:'a'+index,val: this.data.data[k]})
        } else if(index>=4 && index<=7){
          this.con.push({name: k,row:'a'+index,val: this.data.data[k]})
        } else if(index>=8 && index<=10){
          this.con.push({name: k,row:'a'+index,val: this.data.data[k]})
        } else {
          this.con.push({name: k,row:'a'+index,val: this.data.data[k]})
        }
        index++
      } else{
        this.items.forEach(i=>{
          if(i.name==k) this.mask.controls[k].setValue(this.data.data[k])
        })
      }
    })
    this.inputData()
  }

  onNoClick(){
    this.dialogRef.close()
  }


  send(){
    this.dialogRef.close(this.mask.value)
  }

  checkPrice(e:any, o:number,auto:boolean){
    let val:string=e.target.value
    if(val.length>7){
      firebase.database().ref('PSDItems').child(this.quarter.getQ(new Date)).child(val).once('value',a=>{
        if(a.val()!=null) {
          if(!auto) this.mask.controls['it'+o].setValue(a.val().desc)
          this.mask.controls['llp'+o].setValue(a.val().llp)
        }
      })
    }
  }

  inputData(){
    firebase.database().ref('Balance').child(this.data.sn).child(this.data.path).set(this.mask.value)
  }

  loadParts(){
    let maxLines:number=20
    let max:number=0
    let k:string[] = Object.keys(this.mask.value)
    let length:number=k.length
    let index:number=0
    new Promise((res,rej)=>{
      k.forEach(key=>{
        if(key.substring(0,1)=='_'){
          if(this.mask.value[key]!='') parseInt(key.substring(4,6))>max?max=parseInt(key.substring(4,6)):null
        }
        index++
        if(index==length) res(max)
      })
    }).then((max:any)=>{
      const dialogRef=this.dialog.open(ImportpartsComponent)
      dialogRef.afterClosed().subscribe(result=>{
        if(result) {
          let lines:string[] = result.split('\n')
          let ll = lines.filter(l=>{
            if(l!='') return l
            return null
          })
          if(ll.length>(maxLines-max)){
            alert('Too many parts')
          }else{
            this.addParts(ll,max+1)
          }
        }
        
      })
    })
  }

  addParts(list:string[],start:number){
    let index:number=0
    let length:number=list.length
    let ind:number=0
    list.forEach((line,i)=>{
      let it:string[]=line.split('\t')
      index=start+i
      this.mask.controls['_pnr'+index].setValue(it[0])
      this.mask.controls['_ite'+index].setValue(it[1])
      this.mask.controls['_qty'+index].setValue(it[2])
      ind++
    })
  }
}
