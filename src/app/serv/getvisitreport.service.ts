import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import { SelectrangedialogComponent } from '../comp/util/dialog/selectrangedialog/selectrangedialog.component';
import * as moment from 'moment'
import firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class GetvisitreportService {

  constructor(private dialog:MatDialog) { }

  loadReportData(){
    let result:any[]=[]
    return new Promise((res,rej)=>{
      const d = this.dialog.open(GenericComponent, {disableClose:true, data:{msg:'Retreiving data...'}})
      setTimeout(() => {
        d.close()
      }, 10000);
      const dii = this.dialog.open(SelectrangedialogComponent,{disableClose:true,data:''})
      dii.afterClosed().subscribe(rex=>{
        let start=moment(rex[0]).add(-1,'days').format('YYYYMMDD')
        let end=moment(rex[1]).add(1,'days').format('YYYYMMDD')
        firebase.database().ref('CustVisit').orderByKey().startAfter(start).endBefore(end).once('value',a=>{
          if(a.val()!=null) {
            a.forEach(b=>{
              b.forEach(c=>{
                c.forEach(d=>{
                  result.push(d.val())
                })
              })
            })
          }
        })
        .then(()=>{
          res(result)
          d.close()
        })
      })
    })
  }
}
