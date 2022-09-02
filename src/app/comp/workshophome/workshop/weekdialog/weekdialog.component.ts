import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment'; 
import firebase from 'firebase/app';
import { DaytypesjService } from 'src/app/serv/daytypesj.service';
import { SubmitweekdialogComponent } from './submitweekdialog/submitweekdialog.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service'


@Component({
  selector: 'episjob-weekdialog',
  templateUrl: './weekdialog.component.html',
  styleUrls: ['./weekdialog.component.scss']
})
export class WeekdialogComponent implements OnInit {
  week:any[]=[]
  weekNr:any|undefined
  start:string=''
  weekForm!:FormGroup
  
  mese:string=''
  anno:string=''
  disa:boolean=false
  pos:string=''
  firstLetter:string=''
  rej:boolean=false
  subsList:Subscription[]=[]

  constructor(private dialogRef:MatDialogRef<WeekdialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb:FormBuilder, private day:DaytypesjService, private dialog:MatDialog, private auth:AuthServiceService) {
    this.weekForm = fb.group({
      d1:[''],d2:[''],d3:[''],d4:[''],d5:[''],d6:[''],d7:[''],
      dd1:[''],dd2:[''],dd3:[''],dd4:[''],dd5:[''],dd6:[''],dd7:[''],
      v11:[0],v12:[0],v13:[0],v14:[0],v15:[0],v16:[0],v17:[0],
      v21:[0],v22:[0],v23:[0],v24:[0],v25:[0],v26:[0],v27:[0],
      v81:[0],v82:[0],v83:[0],v84:[0],v85:[0],v86:[0],v87:[0],
    })
  }

  ngOnInit(): void {
    this.firstLetter=this.data.ws.substring(0,1)
    let today:Date=new Date()
    this.start= moment(today).subtract(today.getDay()-1,'days').format('YYYY-MM-DD')
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.Pos
          this.createWeek()
        }
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
    let sum:number=0
    firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('days').once('value',a=>{
      sum=0
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            if(c.key=='v1' || c.key=='v2' || c.key=='v8') sum+=c.val()
          })
        })
      }
    })
    .then(()=>{
      firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('hrs').set(sum)
    })
  }

  onNoClick(){
    this.dialogRef.close()
  }

  createWeek(){
    this.weekNr = getWeekNumber(new Date(this.start))
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
    this.rej=false
    for(let i =0;i<7;i++){
      let yi = moment(this.start).add(i,'days').format('YYYY-MM-DD')
      this.week.push({day:yi,holy:this.day.dayType(new Date(yi))})
      this.weekForm.controls['v1'+(i+1)].setValue(0)
      this.weekForm.controls['v2'+(i+1)].setValue(0)
      this.weekForm.controls['v8'+(i+1)].setValue(0)
      //console.log(this.day.dayType(new Date(yi)))
      if(this.pos=='wsadmin'){
        let ref=firebase.database().ref('wsFiles').child('open')
        ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
          if(a.val()){
            a.forEach(b=>{
              let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
              if(typeof b.val()=='number') this.weekForm.controls[b.key!+u].setValue(b.val())
            })
          }
        })
        .finally(()=>{
          ref=firebase.database().ref('wsFiles').child('sent')
          ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
            if(a.val()){a.forEach(b=>{
                let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
                if(typeof b.val()=='number') {
                  this.weekForm.controls[b.key!+u].setValue(b.val())
                  //this.week[u-1].sent=true
                }
              })
            }
          })
          .finally(()=>{
            ref=firebase.database().ref('wsFiles').child('temp')
            ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
              if(a.val()){a.forEach(b=>{
                  let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
                  if(typeof b.val()=='number') {
                    this.weekForm.controls[b.key!+u].setValue(b.val())
                    delete this.week[u-1].sent
                    this.week[u-1].temp=true
                  }
                })
              }
            })
          })
        }).finally(()=>{
          ref=firebase.database().ref('wsFiles').child('lockws')
          ref.child(this.data.sn).child(this.data.id).child('days').child(yi).child('lock').once('value',c=>{
            if(c.val() && c.val()==true) {
              let i=this.week.map(f=>{return f.day}).indexOf(yi)
              this.weekForm.controls['v1'+(i+1)].disable()
              this.weekForm.controls['v2'+(i+1)].disable()
              this.weekForm.controls['v8'+(i+1)].disable()
            } else{
              let i=this.week.map(f=>{return f.day}).indexOf(yi)
              this.weekForm.controls['v1'+(i+1)].enable()
              this.weekForm.controls['v2'+(i+1)].enable()
              this.weekForm.controls['v8'+(i+1)].enable()
            }
          })
        })
      } else{
        let ref=firebase.database().ref('wsFiles').child('open')
        ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
          if(a.val()){
            a.forEach(b=>{
              let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
              if(typeof b.val()=='number') this.weekForm.controls[b.key!+u].setValue(b.val())
            })
          }
        })
        .finally(()=>{
          ref=firebase.database().ref('wsFiles').child('lockws')
          ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
            let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
            if(a.val()!=null) {
              this.week[u-1].lock=true
            } else {
              this.week[u-1].lock=false
            }
          })
          ref=firebase.database().ref('wsFiles').child('sent')
          ref.child(this.data.sn).child(this.data.id).child('days').child(yi).once('value',a=>{
            if(a.val()!=null){
              this.rej=true
              a.forEach(b=>{
                let u=this.week.map(f=>{return f.day}).indexOf(a.key)+1
                if(typeof b.val()=='number') {
                  this.weekForm.controls[b.key!+u].setValue(b.val())
                  this.week[u-1].sent=true
                }
              })
            }
          })
        })
      }
    }
  }

  reject(){
    this.week.map(a=>{
      firebase.database().ref('wsFiles').child('sent').child(this.data.sn).child(this.data.id).child('days').child(a.day).remove()
      .finally(()=>{
        firebase.database().ref('wsFiles').child('lockws').child(this.data.sn).child(this.data.id).child('days').child(a.day).remove()
        .finally(()=>{this.createWeek()})
      })
    })
  }

  moveWeek(a:string){
    if(a=='+') this.start=moment(this.start).add(1,'week').format('YYYY-MM-DD')
    if(a=='-') this.start=moment(this.start).add(-1,'week').format('YYYY-MM-DD')
    this.createWeek()
  }

  write(y:any,lab:string,i:number){
    let d:string = y.day
    if(this.weekForm.controls[lab+(i+1)].value>0) {
      let ref:any
      if(this.pos=='wsadmin') {
        ref = firebase.database().ref('wsFiles').child('temp').child(this.data.sn).child(this.data.id).child('days').child(d)
      }else{
        ref = firebase.database().ref('wsFiles').child('open').child(this.data.sn).child(this.data.id).child('days').child(d)
      }
      let dataSet=this.weekForm.controls[lab+(i+1)].value
      ref.child(lab).set(dataSet)
    }
    let ref1:any
    if(this.pos=='wsadmin') {
      ref1 = firebase.database().ref('wsFiles').child('temp')
    }else{
      ref1 = firebase.database().ref('wsFiles').child('open')
    }
    if((this.weekForm.controls['v1'+(i+1)].value==0 || this.weekForm.controls['v1'+(i+1)].value=='')&&(this.weekForm.controls['v2'+(i+1)].value==0 || this.weekForm.controls['v2'+(i+1)].value=='')&&(this.weekForm.controls['v8'+(i+1)].value==0 || this.weekForm.controls['v8'+(i+1)].value=='')) {
      ref1.child(this.data.sn).child(this.data.id).child('days').child(d).remove()
    } else if(this.weekForm.controls[lab+(i+1)].value==0 || this.weekForm.controls[lab+(i+1)].value=='') {
      ref1.child(this.data.sn).child(this.data.id).child('days').child(d).child(lab).remove()
    }
  }

  save(){
    const d = this.dialog.open(SubmitweekdialogComponent, {data:{nr:this.weekNr}})
    d.afterClosed().subscribe(res=>{
      if(res){
        this.week.map(i=>{return i.day}).forEach(r=>{
          let ref=firebase.database().ref('wsFiles').child('temp')
          let ref1=firebase.database().ref('wsFiles').child('temp')
          let ref2=firebase.database().ref('wsFiles').child('temp')
          if(this.pos=='wsadmin') {
            ref=firebase.database().ref('wsFiles').child('temp')
            ref1=firebase.database().ref('wsFiles').child('sent')
            ref2=firebase.database().ref('wsFiles').child('lockws')
            ref.child(this.data.sn).child(this.data.id).child('days').child(r).once('value',o=>{
              if(o.val()!=null) ref1.child(this.data.sn).child(this.data.id).child('days').child(r).set(o.val())
              .finally(()=>{
                ref.child(this.data.sn).child(this.data.id).child('days').child(r).remove()
              })
              ref2.child(this.data.sn).child(this.data.id).child('days').child(r).child('lock').set(true)
            })
          } else {
            ref=firebase.database().ref('wsFiles').child('sent')
            ref1=firebase.database().ref('wsFiles').child('open')
            ref2=firebase.database().ref('wsFiles').child('lockws')
            ref.child(this.data.sn).child(this.data.id).child('days').child(r).once('value',p=>{
              if(p.val()!=null) {
                let y = p.val()
                delete y.temp
                ref1.child(this.data.sn).child(this.data.id).child('days').child(r).set(y)
                
              }
            })
            .finally(()=>{
              ref.child(this.data.sn).child(this.data.id).child('days').child(r).remove()
              ref2.child(this.data.sn).child(this.data.id).child('days').child(r).child('lock').set(true)
            })
            

          }
        })
        this.createWeek()
        this.dialogRef.close()
      }
    })
  }

  unlock(){
    let ref1= firebase.database().ref('wsFiles').child('open')
    let ref2= firebase.database().ref('wsFiles').child('sent')
    this.week.map(a=>{return a.day}).forEach(r=>{
      ref1.child(this.data.sn).child(this.data.id).child('days').child(r).once('value',po=>{
        if(!po.val().v1 && !po.val().v2 && !po.val().v8) {
          ref1.child(this.data.sn).child(this.data.id).child('days').child(r).remove()
        } else {
          ref1.child(this.data.sn).child(this.data.id).child('days').child(r).child('lock').set(false)
        }
        
      })
      ref2.child(this.data.sn).child(this.data.id).child('days').child(r).child('lock').once('value',lo=>{
        if(lo.val()!=null) ref2.child(this.data.sn).child(this.data.id).child('days').child(r).child('lock').set(false)
      })
    })
    this.createWeek()
  }

  chPos(role:string){
    return this.auth.acc(role)
  }

  lock(i:number){
    let ref=firebase.database().ref('wsFiles').child('lockws').child(this.data.sn).child(this.data.id).child('days').child(this.week[i].day)
    ref.once('value',a=>{
      if(a.val()==null) {
        ref.set({lock:true})
        .then(()=>{
          this.week[i].lock=true
        })
      } else {
        ref.remove()
        .then(()=>{
          this.week[i].lock=false
        })
      }
    })
  }
}

function getWeekNumber(d:any) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7))
  var yearStart:any = new Date(Date.UTC(d.getUTCFullYear(),0,1))
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
  return weekNo
}

