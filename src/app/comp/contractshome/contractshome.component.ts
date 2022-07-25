import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import * as moment from 'moment'
import * as XLSX from 'xlsx-js-style'
import { ExcelService } from 'src/app/serv/excelexport.service';

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
  constructor(private excel:ExcelService , private auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.pos
          setTimeout(() => {
            this.allow=this.auth.allow('Internal',this.pos)

          }, 1);
        }
      })
    )
    this.loadContracts()
    this.loadArchived()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadContracts(){
    firebase.database().ref('Contracts').child('active').on('value',a=>{
      if(a.val()){
        new Promise(res=>{
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
                if(ch==leng) {
                  this.contractsSpin=false
                  res(this.contractList)
                }
              })
            })
          })
        })
      } else {
        this.contractsSpin=false
      }
    })
  }

  

  getKeys(list:any[]){
    let keysList:string[]=[]
    let ch:number=list.length
    let index:number=0
    return new Promise(res=>{
      list.forEach(item=>{
        let keys1:string[]=Object.keys(item)
        keys1.forEach(k=>{
          if(k!='fees' && k!='discounts' && k!='att' && k!='id' && k!='custCode') {
            if(!keysList.includes('0' + k)) {
              keysList.push('0' + k)
            }
          } else if(k=='fees'){
            let gg:any= Object.values(item)[keys1.indexOf(k)]
            let keys2:string[]=Object.keys(gg)
            keys2.forEach(k2=>{
              if(!keysList.includes('1' +k2)) keysList.push('1' + k2)
            })
          }
          index++
          if(index==ch){res(keysList)}
        })
      })
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
