import {FormGroup, FormBuilder,Validators } from '@angular/forms'
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material/dialog';
import { ConfirmreplacementComponent } from '../confirmreplacement/confirmreplacement.component';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-accesslist',
  templateUrl: './accesslist.component.html',
  styleUrls: ['./accesslist.component.scss']
})
export class AccesslistComponent implements OnInit {
  info!:FormGroup
  constructor(private dialog:MatDialog, private fb:FormBuilder, public dialogRef: MatDialogRef<AccesslistComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.info=fb.group({
      area:['',Validators.required],
      list: ['',Validators.required]
    })
  }
  
  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  upload(){
    let area:number = this.info.value.area
    let list:string = this.info.value.list
    let arrays:any[]=[]
    let a1:any[] = list.split('\n')
    let a2:any[] = list.split(';')
    let a3:any[] = list.split(',')
    let a4:any[] = list.split('-')
    arrays.push(a1,a2,a3,a4)
    let l:number = Math.max(a1.length,a2.length,a3.length,a4.length)
    let temp:any[]=[]
    arrays.forEach(arr=>{
      if(arr.length==l) temp=arr
    })
    temp.forEach((t,i)=>{
      if(t=='') temp.splice(i,1)
    })  
    let dia= this.dialog.open(ConfirmreplacementComponent)
    dia.afterClosed().subscribe(res=>{
      if(res=='rep') {
        let lll:any[]=[]
        firebase.database().ref('RigAuth').once('value',list=>{
          if(list.val()!=null) {
            lll=Object.keys(list.val())
          }
        }).then(()=>{
          if(lll.length>0){
            lll.forEach(l=>{
              firebase.database().ref('RigAuth').child(l).child('a3').set('0')
            })
          }
          setTimeout(() => {
            temp.forEach(t=>{
              console.log(t)
              firebase.database().ref('RigAuth').child(t).child('a'+area).set('1').then(()=>{this.dialogRef.close()})
            })
          }, 500);
        })
      }
      if(res=='add') {
        temp.forEach(t=>{
          firebase.database().ref('RigAuth').child(t).child('a'+area).set('1').then(()=>{this.dialogRef.close()})
        })
      }
    }) 
  }

  checkNr(){
    let nr:number=this.info.controls.area.value
    if(nr<1 || nr>90) this.info.controls.area.setErrors({err:'outofrange'})
  }

}
