import { HttpClient } from '@angular/common/http';
import { summaryFileName } from '@angular/compiler/src/aot/util';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { machineLearning } from 'firebase-admin';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { CheckConsuntivoQtyService } from 'src/app/serv/check-consuntivo-qty.service';
import { GetPotYearService } from 'src/app/serv/get-pot-year.service';
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { environment } from 'src/environments/environment';
import { ConfirmComponent } from '../confirm/confirm.component';
import { GenericComponent } from '../generic/generic.component';
import { ImportpartsComponent } from '../importparts/importparts.component';

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
  constructor(private check: CheckConsuntivoQtyService , private http: HttpClient, private getQ:GetquarterService, private dialog:MatDialog, private fb:FormBuilder, private dialogRef:MatDialogRef<ConsuntivoComponent,any>,@Inject(MAT_DIALOG_DATA) public data:any, private quarter:GetquarterService) {
    this.mask=fb.group({},{validators:check.checkQ()})
  }

  ngOnInit(): void {
    for(let i=1;i<21;i++){
      this.buttons.push(i)
    }
    for(let i=1;i<21;i++){
      this.checks.push(i)
      this.mask.addControl('__RDT'+i,new FormControl(false))
    }
    this.keys= Object.keys(this.data.data)    
    let index:number=1
    let decimal=/^-?\d*[.,]?\d{0,2}$/
    for(let r=1;r<=20;r++){
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
      if(k.substring(0,2)=='__'){
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
  }

  onNoClick(){
    this.dialogRef.close()
  }


  send(){
    let dia=this.dialog.open(GenericComponent,{data:{msg:'Generating pdf...'}})
    setTimeout(() => {
      dia.close()
    }, 10000);
    this.http.post(environment.url + 'consuntivo',this.mask.value,{responseType:'arraybuffer'}).subscribe((o:any)=>{
      if(o){
        const blob = new Blob([o], { type: 'application/pdf' });
        let w = window.open(URL.createObjectURL(blob),'_blank')
        /*let downloadURL=URL.createObjectURL(blob)
        var link = document.createElement('a')
        link.href = downloadURL
        link.download = this.mask.controls.a230rig.value + ' - ' + this.mask.controls.a170customer1.value + ".pdf"
        link.click()*/
        dia.close()
      } else {
        dia.close()
      }
    })
    this.dialogRef.close(this.mask.value)
  }

  checkPrice(e:any, name:string){
    if(name.substring(0,4)=='_pnr'){
      let val:string=e.target.value
      if(val.length>7){
        firebase.database().ref('PSDItems').child(this.quarter.getQ(new Date)).child(val).once('value',a=>{
          if(a.val()!=null) {
            this.mask.controls['_ite'+name.substring(4,6)].setValue(a.val().desc)
            this.mask.controls['_llp'+name.substring(4,6)].setValue(a.val().llp)
            this.inputData()
          }
          else{
            this.mask.controls['_ite'+name.substring(4,6)].setValue('')
            this.mask.controls['_llp'+name.substring(4,6)].setValue('')
            this.mask.controls['_qty'+name.substring(4,6)].setValue('')
            this.inputData()
          }
        })
      } else {
          this.mask.controls['_ite'+name.substring(4,6)].setValue('')
          this.mask.controls['_llp'+name.substring(4,6)].setValue('')
          this.mask.controls['_qty'+name.substring(4,6)].setValue('')
          this.inputData()
      }
    }
    this.inputData()
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
            .then(()=>{
              this.inputData()
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
        this.inputData()
      }
    })
  }

  reset(){
    let dia = this.dialog.open(ConfirmComponent, {data:{msg: 'Clear data?', title: 'Clear'}})
    dia.afterClosed().subscribe(res=>{
      if(res){
        console.log(res)
        firebase.database().ref('Balance').child(this.data.sn).child(this.data.path).remove()
        .then(()=>{
          location.reload()
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
