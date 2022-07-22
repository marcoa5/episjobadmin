import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetquarterService } from './getquarter.service';
import { promise } from 'protractor';
import { SelectrangedialogComponent } from '../comp/util/dialog/selectrangedialog/selectrangedialog.component';
import * as moment from 'moment';
import { Clipboard } from '@angular/cdk/clipboard';
import { blockParams } from 'handlebars';
@Injectable({
  providedIn: 'root'
})
export class GetPartPerTechService {

  constructor(private dialog:MatDialog, private getH:GetquarterService, private http:HttpClient, private clip:Clipboard) { }

  loadParts(){
    return new Promise(res=>{
      let rawList:any[]=[]
      firebase.database().ref('PartReqSent').once('value',a=>{
        a.forEach(b=>{
          b.forEach(c=>{
            rawList.push(c.val())
          })
        })
      })
      .then(()=>{
        let names:any[]=[]
        rawList.map(af=>{
          if(!names.includes(af.orig)) names.push(af.orig)
        })
        const d = this.dialog.open(GenericComponent, {disableClose:true, data:{msg:'Retreiving data...'}})
        const dii = this.dialog.open(SelectrangedialogComponent,{disableClose:true,data:''})
        dii.afterClosed().subscribe(resp=>{
          if(resp && resp[0] && resp[1]){
            let i:string=moment(resp[0]).format('YYYY-MM-DD')
            let f:string=moment(resp[1]).format('YYYY-MM-DD')
            this.getSingleList(rawList,names,f,i)
            .then((list:any)=>{
              d.close()
              let exp:any[]=[]//string=`Parts Report\nFrom:\t${moment(i).format('DD/MM/YYYY')}\nTo:\t${moment(f).format('DD/MM/YYYY')}\n\nName\tQty\tTot Amout`
              let leng:number = list.length
              let indexy:number =0
              list.forEach((b:any)=>{
                exp.push({
                  Name:b[0],
                  Qty:b[1],
                  Amount:b[2].replace(/[.]/g,',')
                })
                //exp+='\n'+b.toString().replace(/,/g,'\t').replace(/[.]/g,',')
                indexy++
                if(indexy==leng) {
                  res([exp,i,f])
                }
              })
            })
          } else{
            d.close()
          }
        })
      })
    })
  }

  

  getSingleList(rawList:any[],names:any[], fine:string,inizio:string){
    let list:any[]=[]
    let chNames:number = names.length
    let indexNames:number=0
    return new Promise(res=>{
      names.forEach(b=>{
        let filteredList:any[]=rawList.filter((a:any)=>{
          if(a.date) {
            let a1:number=parseInt(a.date.replace(/-/g,''))
            let i:number=parseInt(inizio.replace(/-/g,''))
            let f: number=parseInt(fine.replace(/-/g,''))
            if(a.orig==b && a1<=f && a1>=i) return a
            return false}
          return false
        })
        this.getFilteredList(filteredList,b)
        .then((tot:any)=>{
          if(tot.length>0) list.push(tot)
          indexNames++
          if(chNames==indexNames) res(list)
        })
      })
    })
  }

  getFilteredList(filteredList:any[],name:string){
    let tot:number=0
    let index:number=0
    let ch=filteredList.length
    return new Promise(res=>{
      if(filteredList.length>0){
        filteredList.forEach(f=>{
          let partArr:string[]=[]
          f.Parts.forEach((e:any) => {
            partArr.push(e.pn)
          })  
          let url:string = environment.url
          let params = new HttpParams()
          .set('child',this.getH.getQ(f.date))
          .set("parts",partArr.toString())
          this.http.get(url + 'psdllp',{params:params}).subscribe(gt=>{
            let total:any=0
            f.Parts.forEach((fr:any)=>{
              let index = Object.values(gt).map(y=>{return y.pn}).indexOf(fr.pn)
              if(index>-1) {
                fr.llp=Object.values(gt)[index].llp
                fr.tot=Math.round(fr.llp * fr.qty*100)/100
                total+=fr.tot
              }
            })
            f.Parts['totAmount']=parseFloat(total)
            tot+=parseFloat(total)
            index++
            if(index==ch) {res([name,index,tot.toFixed(2)])}
          })
        })
      } else {
        res([])
      }
    })
  }
}
