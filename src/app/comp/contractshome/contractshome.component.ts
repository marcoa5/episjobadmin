import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import * as moment from 'moment'
import { getSafePropertyAccessString, JitSummaryResolver } from '@angular/compiler';

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
        }).then((a:any)=>{
          //this.getDownload(a)
        })
      } else {
        this.contractsSpin=false
      }
    })
  }

  getDownload(list:any[]){
    let data:string=''
    this.getKeys(list).then((keys:any)=>{
      keys.sort()
      data+=(keys.join('\t')+'\n').toUpperCase()
      list.forEach(item=>{
        let temp:any[]=[]
        keys.forEach((k:any)=>{
          if(k.substring(0,1)=='0') {
            temp[keys.indexOf(k)]=item[k.substring(1,10000)]
          } else if(k.substring(0,1)=='1'){
            try{
              if(item.fees[k.substring(1,10000)]) temp[keys.indexOf(k)]=parseFloat(item.fees[k.substring(1,10000)]).toFixed(2).replace(/[.]/g,',')
            } catch {}
          }
          //if(keys.indexOf('1' + k)>-1) temp[keys.indexOf('1' + k)]=item[k]
        })
        data+=temp.join('\t') + '\n'
      })
      console.log(data)
      navigator.clipboard.writeText(data)
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
