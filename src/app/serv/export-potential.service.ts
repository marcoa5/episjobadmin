import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import firebase from 'firebase/app'
import { SelectyearComponent } from '../comp/util/dialog/selectyear/selectyear.component';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';

@Injectable({
  providedIn: 'root'
})
export class ExportPotentialService {

  constructor(private dialog:MatDialog) { }

  export(){
    return new Promise(res=>{
      let values:any[]=[]
      firebase.database().ref('Potential').once('value',a=>{
        if(a.val()!=null) {values=a.val()}
      })
      .then(()=>{
        this.getYears(values).then(years=>{
          let d = this.dialog.open(SelectyearComponent,{data:{title:'Download Potential Data', years:years}})
          d.afterClosed().subscribe(val=>{
            if(val) {
              this.getData(values, val)
              .then(a=>{
                res(a)
              })
            }
          })
        })
      })
    })
  }

  getYears(values:any[]){
    let years:any[]=[]
    let length:number = Object.values(values).length
    let index:number=0
    return new Promise(res=>{
      Object.values(values).forEach((a:any)=>{
        Object.keys(a).forEach(b=>{
          if(!years.includes(b)) years.push(b)
        })
        index++
        if(index==length) res(years)
      })
    })
  }

  getData(values:any, year:any){
    let pot:any[]=[]
    return new Promise(res=>{
      const d = this.dialog.open(GenericComponent, {disableClose:true, data:{msg:'Collecting info'}})
      setTimeout(() => {
        d.close
      }, 10000);
      firebase.database().ref('Potential').once('value',a=>{
        if(a.val()!=null) {
          a.forEach(b=>{
            b.forEach(c=>{
                if(c.key==year){
                  let t = b.key!.split('-')
                  let temp:any={CustomerId:t[0], Customer:t[1]+(t[2]?t[2]:'')+(t[3]?t[3]:'')}
                  let k = Object.keys(c.val())
                  let v = Object.values(c.val())
                  let rf = v.map((va:any)=>{
                    if(!isNaN(parseInt(va))) {
                      return parseInt(va)
                    } else {return 0}
                  })
                  let nuovo:any={}
                  for(let i in k){
                    nuovo[k[i]]=rf[k.indexOf(k[i])]
                  }
                  let fin = Object.assign(temp,nuovo)
                  if(fin) pot.push(fin)
                }
            })
          })
        }
      })
      .then(()=>{
        d.close()
        res(pot)
      })
    })
  }
}
