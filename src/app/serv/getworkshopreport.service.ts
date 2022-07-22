import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx-js-style'
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import { SelectmonthComponent } from '../comp/workshophome/workshop/selectmonth/selectmonth.component';
import { ExcelService } from './excelexport.service';
import firebase from 'firebase/app'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GetworkshopreportService {

  constructor(private excel:ExcelService, private clip:Clipboard, private dialog:MatDialog) { }

  report(data:any){
    const d = this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Retreiving data...'}})
    setTimeout(() => {
      d.close()
    }, 20000);
    let out:any[]=[]
    if(data.days){
      let f:any[] = Object.keys(data.days)
      let length:number=f.length
      let check:number=0
      new Promise(res=>{
        f.forEach(a=>{
          let temp:any=Object.values(data.days)[f.indexOf(a)]
            let t:any={}
            t.Date=new Date(a)
            t[data.ws.substring(0,1) + '1']=temp.v1?temp.v1:'0'
            t[data.ws.substring(0,1) + '2']=temp.v2?temp.v2:'0'
            t[data.ws.substring(0,1) + '8']=temp.v8?temp.v8:'0'
            out.push(t)
          check++
          if(check==length) res('')
        })
      })
      .then(()=>{
        out.sort((a:any,b:any)=>{
          if(a.Date>b.Date) return 1
          if(a.Date<b.Date) return -1
          return 0
        })
        let name:string=data.file
        let cols:string[]=['Date',data.ws.substring(0,1) + '1',data.ws.substring(0,1) + '2',data.ws.substring(0,1) + '8']
        let colWidth:any[]=[120,60,60,60]

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out)

        let Sheets:any={}
        Sheets[name]=worksheet
        const workbook: XLSX.WorkBook = { 
          Sheets, 
          SheetNames: [name] 
        }
        this.excel.exportAsExcelFile(workbook,name + ' - Details',cols,colWidth)
        d.close()
      })
    }
  }

  month(a:any){
    const mese = this.dialog.open(SelectmonthComponent, {data:''})
    mese.afterClosed().subscribe(da=>{
      if(da){
        let dy=da.getDay()==0?7:da.getDay()
        const d = this.dialog.open(GenericComponent,{data:{msg:'Exporting data...'}})
        setTimeout(() => {
          d.close()
        }, 10000);
        let out:any[]=[]
        firebase.database().ref('wsFiles').child('open').child(a.sn).child(a.id).once('value',p=>{
          if(p.val()!=null){
            let m1=moment(da).subtract(dy-1,'days')
            let m2=moment(da).subtract(dy-1,'days').add(1,'weeks').subtract(1,'days')
            let ch:number=0
            for(let i = 0; i<(m2.diff(m1,'days')+1);i++){
              firebase.database().ref('wsFiles').child('open').child(a.sn).child(a.id).child('days').child(moment(m1).add(i,'days').format('YYYY-MM-DD')).once('value',k=>{
                let chDay = new Date(moment(m1).add(i,'days').format('YYYY-MM-DD')).getDay()
                let day:string=''
                switch(chDay){
                  case 0: day= 'DOMENICA'
                  break
                  case 1: day= 'LUNEDI'
                  break
                  case 2: day= 'MARTEDI'
                  break
                  case 3: day= 'MERCOLEDI'
                  break
                  case 4: day= 'GIOVEDI'
                  break
                  case 5: day= 'VENERDI'
                  break
                  case 6: day= 'SABATO'
                  break
                }

                if(k.val()!=null){
                  out.push({
                      Day:day.toUpperCase(),
                      Date: new Date(moment(m1).add(i,'days').format('YYYY-MM-DD')),
                      Hrs1:k.val().v1?k.val().v1:'',
                      Hrs2:k.val().v2?k.val().v2:'',
                      Hrs8:k.val().v8?k.val().v8:''
                  })
                  //`${day.toUpperCase()}\t${moment(m1).add(i,'days').format('DD-MM-YYYY')}\t${k.val().v1?k.val().v1:''}\t${k.val().v2?k.val().v2:''}\t${k.val().v8?k.val().v8:''}\n`
                //} else {
                  //exp+=`${day.toUpperCase()}\t${moment(m1).add(i,'days').format('DD-MM-YYYY')}\t\t\t\n`
                } 
              })
            }
          }
        }).then(()=>{
          if(out.length>0) {
            out.sort((a:any,b:any)=>{
              if(a.Date>b.Date) return 1
              if(a.Date<b.Date) return -1
              return 0
            })
            let name:string=a.file
            let cols:string[]=['Date','Hrs1','Hrs2','Hrs8']
            let colWidth:any[]=[120,120,60,60,60]
    
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out)
    
            let Sheets:any={}
            Sheets[name]=worksheet
            const workbook: XLSX.WorkBook = { 
              Sheets, 
              SheetNames: [name] 
            }
            this.excel.exportAsExcelFile(workbook,name + ' - Details',cols,colWidth)
            d.close()
          } else {
            alert('No data to be exported')
            d.close()
          }
          
        })
      }
    })
  }
}
