import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import * as moment from 'moment';

@Component({
  selector: 'episjob-workshophome',
  templateUrl: './workshophome.component.html',
  styleUrls: ['./workshophome.component.scss']
})
export class WorkshophomeComponent implements OnInit {
  filtro:string=''
  ws:string=''
  pos:string=''
  allow:boolean=false
  subPos:string=''
  _list:any[]=[]
  _listA:any[]=[]
  list:any[]=[]
  listA:any[]=[]
  _tempList:any[]=[]
  tempList:any[]=[]
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.ws=a.ws?a.ws:''
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('ws',this.pos, this.subPos)
          }, 1);
        }
      })
    )
    this.loadFiles()
    this.loadArchived()
    this.loadTemp()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  fil(a:string){
    this.filtro=a
  }

  loadFiles(){
    firebase.database().ref('wsFiles').child('open').on('value',a=>{
      this._list=[]
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            if((this.pos=='wsadmin' && c.val().ws==this.ws) || this.pos!='wsadmin') {
              this.calcMonth(c.val().days).then((a:any)=>{
                let t=c.val()
                t.monthsum=a[0]
                t.yearsum=a[1]
                t.hrs=a[2]
                this.list.push(t)
              })
            }
          })
        })
      }
      this.list=this._list.slice()
    })
  }

  calcMonth(data:any){
    return new Promise(res=>{
      let sumM:number=0
      let sumY:number=0
      let sumT:number=0
      let check:string=moment(new Date()).format('YYYY-MM')
      let days:string[]=data?Object.keys(data):[]
      let ch:number=days.length
      let ind:number=0
      if(days.length>1){
        days.forEach(a=>{
          let hrs:any=Object.values(data)[days.indexOf(a)]
          sumT+=(hrs.v1?hrs.v1:0)+(hrs.v2?hrs.v2:0)+(hrs.v8?hrs.v8:0)
          if(a.substring(0,7)==check) {
            sumM+=(hrs.v1?hrs.v1:0)+(hrs.v2?hrs.v2:0)+(hrs.v8?hrs.v8:0)
          }
          if(a.substring(0,4)==check.substring(0,4)){
            sumY+=(hrs.v1?hrs.v1:0)+(hrs.v2?hrs.v2:0)+(hrs.v8?hrs.v8:0)
          }
          ind++
          if(ind==ch) res([sumM,sumY,sumT])
        })
      } else {
        res([0,0,0])
      }
    })
  }

  loadArchived(){
    firebase.database().ref('wsFiles').child('archived').on('value',a=>{
      this._listA=[]
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            if((this.pos=='wsadmin' && c.val().ws==this.ws) || this.pos!='wsadmin') this._listA.push(c.val())
          })
        })
      }
      this.listA=this._listA.slice()
    })
  }

  loadTemp(){
    if(this.pos=='SU'){
      firebase.database().ref('wsFiles').child('temp').on('value',a=>{
        this._tempList=[]
        this._tempList.push(a.val())
        this.tempList=this._tempList.slice()
      })
    }
  }
}
