import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment'; 
import firebase from 'firebase/app';
@Component({
  selector: 'episjob-weekdialog',
  templateUrl: './weekdialog.component.html',
  styleUrls: ['./weekdialog.component.scss']
})
export class WeekdialogComponent implements OnInit {
  week:any[]=[]
  start:string=''
  weekForm!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  mese:string=''
  anno:string=''
  constructor(private dialogRef:MatDialogRef<WeekdialogComponent>, @Inject(MAT_DIALOG_DATA) private data:any, private fb:FormBuilder) {
    this.weekForm = fb.group({
      d1:[''],d2:[''],d3:[''],d4:[''],d5:[''],d6:[''],d7:[''],
      dd1:[''],dd2:[''],dd3:[''],dd4:[''],dd5:[''],dd6:[''],dd7:[''],
      v11:[0],v12:[0],v13:[0],v14:[0],v15:[0],v16:[0],v17:[0],
      v21:[0],v22:[0],v23:[0],v24:[0],v25:[0],v26:[0],v27:[0],
      v81:[0],v82:[0],v83:[0],v84:[0],v85:[0],v86:[0],v87:[0],
    })
  }

  ngOnInit(): void {
    let today:Date=new Date()
    this.start= moment(today).subtract(today.getDay()-1,'days').format('YYYY-MM-DD')
    this.createWeek()
  }


  onNoClick(){
    this.dialogRef.close()
  }

  createWeek(){
    this.anno=moment(new Date(this.start)).format('YYYY')
    let m1:string=moment(new Date(this.start)).format('MM')
    let m2:string=moment(new Date(this.start)).add(6,'days').format('MM')
    if(m2>m1){
      switch(m2){
        case '01': this.mese='January'; break;
        case '02': this.mese='January/February'; break;
        case '03': this.mese='February/March'; break;
        case '04': this.mese='March/April'; break;
        case '05': this.mese='April/May'; break;
        case '06': this.mese='May/June'; break;
        case '07': this.mese='June/July'; break;
        case '08': this.mese='July/August'; break;
        case '09': this.mese='August/September'; break;
        case '10': this.mese='September/October'; break;
        case '11': this.mese='October/November'; break;
        case '12': this.mese='November/December'; break;
      }
    } else {
      switch(m1){
        case '01': this.mese='January'; break;
        case '02': this.mese='February'; break;
        case '03': this.mese='March'; break;
        case '04': this.mese='April'; break;
        case '05': this.mese='May'; break;
        case '06': this.mese='June'; break;
        case '07': this.mese='July'; break;
        case '08': this.mese='August'; break;
        case '09': this.mese='September'; break;
        case '10': this.mese='October'; break;
        case '11': this.mese='November'; break;
        case '12': this.mese='December'; break;
      }
    }
    this.week=[]
    for(let i =0;i<7;i++){
      let yi = moment(this.start).add(i,'days').format('YYYY-MM-DD')
      this.week.push(yi)
      this.weekForm.controls['v1'+(i+1)].setValue(0)
      this.weekForm.controls['v2'+(i+1)].setValue(0)
      this.weekForm.controls['v8'+(i+1)].setValue(0)
      firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
        if(a.val()){
          a.forEach(b=>{
            let u=this.week.indexOf(a.key)+1
            this.weekForm.controls[b.key!+u].setValue(b.val())
            
          })
        }
      })
    }
  }

  moveWeek(a:string){
    if(a=='+') this.start=moment(this.start).add(1,'week').format('YYYY-MM-DD')
    if(a=='-') this.start=moment(this.start).add(-1,'week').format('YYYY-MM-DD')
    this.createWeek()
  }

  write(d:string,lab:string,i:number){
    if(this.weekForm.controls[lab+(i+1)].value>0) firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('days').child(d).child(lab).set(this.weekForm.controls[lab+(i+1)].value)
    if(this.weekForm.controls[lab+(i+1)].value==0) firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('days').child(d).child(lab).remove()
  }

}
