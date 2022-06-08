import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import * as moment from 'moment'

@Component({
  selector: 'episjob-contractshome',
  templateUrl: './contractshome.component.html',
  styleUrls: ['./contractshome.component.scss']
})
export class ContractshomeComponent implements OnInit {

  allow:boolean=false
  pos:string=''
  contractsSpin:boolean=true
  archivedSpin:boolean=true
  contractList:any[]=[]
  archivedList:any[]=[]

  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.pos
          setTimeout(() => {
            this.allow=this.auth.allow('Internal',this.pos)
            if(this.allow) {
              this.loadContracts()
              this.loadArchived()
            }
          }, 1);
        }
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadContracts(){
    firebase.database().ref('Contracts').child('active').on('value',a=>{
      if(a.val()){
        let leng:number=Object.values(a.val()).length
        let ch:number=0
        this.contractList=[]
        a.forEach(b=>{
          b.forEach(c=>{
            c.forEach(d=>{
              let g=d.val()
              g.daysleft=this.chDate(d.val().end)
              this.contractList.push(g)
              ch++
              if(ch==leng) this.contractsSpin=false
            })
          })
        })
      } else {
        this.contractsSpin=false
      }
    })
  }

  loadArchived(){
    firebase.database().ref('Contracts').child('archived').on('value',a=>{
      if(a.val()) {
        let leng:number=Object.values(a.val()).length
        let ch:number=0
        this.archivedList=[]
        a.forEach(b=>{
          b.forEach(c=>{
            c.forEach(d=>{
              let g=d.val()
              g.daysleft=this.chDate(d.val().end)
              this.archivedList.push(g)
              ch++
              if(ch==leng) this.archivedSpin=false
            })
          })
        })
      } else {
        this.archivedSpin=false
      }
    })
  }

  chDate(a:any){
    let da = moment(new Date(a))
    let today = moment(new Date())
    return da.diff(today,'days')
  }

}
