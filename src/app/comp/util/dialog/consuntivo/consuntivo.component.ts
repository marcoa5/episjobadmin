import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { CheckConsuntivoQtyService } from 'src/app/serv/check-consuntivo-qty.service'
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { SendbalanceService } from 'src/app/serv/sendbalance.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { GenericComponent } from '../generic/generic.component';
import { ImportpartsComponent } from '../importparts/importparts.component';
import { SavedialogComponent } from '../savedialog/savedialog.component';

@Component({
  selector: 'episjob-consuntivo',
  templateUrl: './consuntivo.component.html',
  styleUrls: ['./consuntivo.component.scss']
})
export class ConsuntivoComponent implements OnInit {
  keys:any[]=[]
  checks:any[]=[]
  items:any[]=[]
  con:any[]=[]
  it:any[]=[]
  myModel:any
  selectedType:any
  mask!:FormGroup
  buttons:any[]=[]
  originalData:any={}
  change:boolean=false
  numberOfLines:number=26
  constructor(private sendbalance:SendbalanceService,  private check: CheckConsuntivoQtyService , private http: HttpClient, private getQ:GetquarterService, private dialog:MatDialog, private fb:FormBuilder, private dialogRef:MatDialogRef<ConsuntivoComponent,any>,@Inject(MAT_DIALOG_DATA) public data:any, private quarter:GetquarterService) {
    this.mask=fb.group({},{validators:check.checkQ()})
  }

  ngOnDestroy(){
    
  }

  ngOnInit(): void {
    for(let i=1;i<(this.numberOfLines+1);i++){
      this.buttons.push(i)
    }
    for(let i=1;i<(this.numberOfLines+1);i++){
      this.checks.push(i)
      this.mask.addControl('__RDT'+i,new FormControl(false))
    }
    this.keys= Object.keys(this.data.data)    
    let index:number=1
    let decimal=/^-?\d*[.,]?\d{0,2}$/
    for(let r=1;r<(this.numberOfLines+1);r++){
      this.items.push({name: '_pnr'+r,row:'r'+r, col:'c'+1,val: '', label:'p/n'})
      this.mask.addControl('_pnr'+r,new FormControl(''))
      this.items.push({name: '_ite'+r,row:'r'+r, col:'c'+2,val: '', label:'Description'})
      this.mask.addControl('_ite'+r,new FormControl(''))
      this.items.push({name: '_llp'+r,row:'r'+r, col:'c'+3,val: '', label:'List Price'})
      this.mask.addControl('_llp'+r,new FormControl('', Validators.pattern(decimal)))
      this.items.push({name: '_qty'+r,row:'r'+r, col:'c'+4,val: '', label:'Qty'})
      this.mask.addControl('_qty'+r,new FormControl('', [Validators.pattern(decimal)]))  ////HERE
    }
    this.keys.forEach(k=>{
      if(k.substring(0,2)=='___'){
      }else if(k.substring(0,2)=='__'){
        if(k.substring(0,5)=='__RDT'){
          this.mask.controls[k].setValue(this.data.data[k])
        } else {
          this.mask.addControl(k,new FormControl(this.data.data[k]))
        }
      } else if(k.substring(0,1)!='_'){
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
      } else {
        this.items.forEach(i=>{
          if(i.name==k) this.mask.controls[k].setValue(this.data.data[k])
        })
      }
    })
    this.inputData()
    this.mask.valueChanges.subscribe(val=>{
      if(val) {
        let check:boolean=false
        Object.values(this.originalData).forEach((i, index)=>{
          if(i!=Object.values(this.mask.value)[index]) check=true
        })
        this.change=check
      }
    })
    this.originalData = this.mask.value
  }

  onNoClick(){
    if(this.change) {
      const dia = this.dialog.open(SavedialogComponent,{data:'Data has been updated, save changes?',disableClose:true})
      dia.afterClosed().subscribe(a=>{
        if(a) this.inputData()
        this.dialogRef.close()
      })
    } else {
      this.dialogRef.close()
    }
  }

  send(){
    if(this.change) {
      this.save(true, 'Data has been updated, before to proceed please save data')
    } else {
      this.sendbalance.send(this.mask.value)
      this.dialogRef.close(this.mask.value)
    }
    
  }
  
  checkPrice(e:any, name:string){
    if(name.substring(0,4)=='_pnr'){
      let val:string=e.target.value
      if(val.length>7){
        firebase.database().ref('PSDItems').child(this.quarter.getQ(new Date)).child(val).once('value',a=>{
          if(a.val()!=null) {
            this.mask.controls['_ite'+name.substring(4,6)].setValue(a.val().desc)
            this.mask.controls['_llp'+name.substring(4,6)].setValue(a.val().llp)
            //this.inputData()
          }
          else{
            this.mask.controls['_ite'+name.substring(4,6)].setValue('')
            this.mask.controls['_llp'+name.substring(4,6)].setValue('')
            this.mask.controls['_qty'+name.substring(4,6)].setValue('')
            //this.inputData()
          }
        })
      } else {
          this.mask.controls['_ite'+name.substring(4,6)].setValue('')
          this.mask.controls['_llp'+name.substring(4,6)].setValue('')
          this.mask.controls['_qty'+name.substring(4,6)].setValue('')
          //this.inputData()
      }
    }
    //this.inputData()
  }

  save(pdf?:boolean, text?:string){
    let f = this.dialog.open(SavedialogComponent, {data:text?text:'Save data?'})
    f.afterClosed().subscribe(res=>{
      if(res) {
        this.inputData()
        if(pdf){
          this.sendbalance.send(this.mask.value)
          this.dialogRef.close(this.mask.value)
        }
      }
    })
  }

  inputData(){
    let sn:string=this.data.data.___sn
    if(this.data.data.___path){
      let path:string=this.data.data.___path
      firebase.database().ref('Balance').child(sn).child(path).set(this.mask.value)
    } else {
      firebase.database().ref('Quote').child(sn).child('test').set(this.mask.value)
    }
    this.originalData=this.mask.value
    this.change=false
}

  loadParts(){
    let maxLines:number=this.numberOfLines
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
            .then(()=>{
              //this.inputData()
            }) 
          }
        }
      })
    })
  }

  addParts(list:string[],start:number){
    return new Promise((res,rej)=>{
      let len:number = list.length
      let ch:number=0
      let index:number=start
      list.forEach((line,i)=>{
        let it:string[]=line.split('\t')
        this.getPrice(it[0],it[1],it[2],index).subscribe((a:any)=>{
          this.mask.controls['_pnr'+a.id].setValue(a._pnr)
          this.mask.controls['_ite'+a.id].setValue(a._ite)
          this.mask.controls['_qty'+a.id].setValue(a._qty)
          this.mask.controls['_llp'+a.id].setValue(a._llp)
          ch++
          if(ch==len) res('')
        })
        index++
      })
    })
  }

  getPrice(sn:any,desc:any,qty:any,index:any){
    return new Observable(sub=>{
      firebase.database().ref('PSDItems').child(this.getQ.getQ(new Date())).child(sn).child('llp').once('value',a=>{
        if(a.val()!=null) {
          sub.next({_pnr:sn,_ite:desc,_qty:qty,_llp:a.val(),id:index})
        } else {
          sub.next({_pnr:sn,_ite:desc,_qty:qty,_llp:'',id:index})
        }
      })
    })
  }

  delete(r:number){
    let dia= this.dialog.open(ConfirmComponent,{data:{msg:'Remove row nr ' + r + '?',title:'Delete'}})
    dia.afterClosed().subscribe(res=>{
      if(res){
        for(let i = r; i<=20; i++){
          if(i<20){
            this.mask.controls['_pnr'+i].setValue(this.mask.controls['_pnr'+(i+1)].value)
            this.mask.controls['_ite'+i].setValue(this.mask.controls['_ite'+(i+1)].value)
            this.mask.controls['_llp'+i].setValue(this.mask.controls['_llp'+(i+1)].value)
            this.mask.controls['_qty'+i].setValue(this.mask.controls['_qty'+(i+1)].value)
            this.mask.controls['__RDT'+i].setValue(this.mask.controls['__RDT'+(i+1)].value)
            /*this.mask.controls['_dis'+i].setValue(this.mask.controls['_dis'+(i+1)].value)
            this.mask.controls['_tra'+i].setValue(this.mask.controls['_tra'+(i+1)].value)*/
          } else {
            this.mask.controls['_pnr'+i].setValue('')
            this.mask.controls['_ite'+i].setValue('')
            this.mask.controls['_llp'+i].setValue('')
            this.mask.controls['_qty'+i].setValue('')
            this.mask.controls['__RDT'+i].setValue(false)
            /*this.mask.controls['_dis'+i].setValue('')
            this.mask.controls['_tra'+i].setValue('')*/
          }
        }
        //this.inputData()
      }
    })
  }

  reset(){
    let path:string=this.data.path?this.data.path:this.data.data.___path
    let sn:string=this.data.sn?this.data.sn:this.data.data.___sn
    let dia = this.dialog.open(ConfirmComponent, {data:{msg: 'Clear data?', title: 'Clear'}})
    dia.afterClosed().subscribe(res=>{
      if(res){
        console.log(res)
        firebase.database().ref('Balance').child(sn).child(path).remove()
        .then(()=>{
          location.reload()
          this.dialogRef.close()
        })
      }
    })
  }

  sel(e:any, r:number){
    if(e.checked) {
      this.mask.controls['__RDT' + r].setValue(1)
    } else {
      this.mask.controls['__RDT' + r].setValue(0)
    }
  
  }
  
}
