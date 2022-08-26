import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import firebase from 'firebase/app'
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import { ExcelService } from './excelexport.service';
import * as XLSX from 'xlsx-js-style'

@Injectable({
  providedIn: 'root'
})
export class GetfleetutilizationService {

  subsList:Subscription[]=[]
  constructor(private dialog:MatDialog, private excel:ExcelService) { }

  getHRS(rigs:any[],details:boolean){
    const d = this.dialog.open(GenericComponent,{disableClose:true, data:{msg:'Collecting data'}})
    setTimeout(() => {
      d.close()
    }, 20000);
    this.getRawData(rigs,details).then((data:any)=>{
      let name:string=details?'Fleet utilization with hours details':'Fleet utilization'
        let cols:string[]=[]
        let colWidth:any[]=[]
        if(details){
          cols=['Type','Date','Eng','Perc1','Perc2','Perc3','Eng_avg','Perc1_avg','Perc2_avg','Perc3_avg','Sn','Div','Segment','Fam','SubCat','Prov']
          colWidth=[60,120,120,120,120,60,60,60,60,60,60,60,60,60,120,250,250,120,60]
        } else {
          cols=['Type','Eng_avg','Perc1_avg','Perc2_avg','Perc3_avg','Sn','Div','Segment','Fam','SubCat','Prov']
          colWidth=[60,120,120,120,120,60,60,60,60,120,250,250,120,60]
        }
        
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)
        let Sheets:any={}
        Sheets['Fleet Utilization']=worksheet
        const workbook: XLSX.WorkBook = { 
          Sheets, 
          SheetNames: ['Fleet Utilization'] 
        }
      this.excel.exportAsExcelFile(workbook,name,cols,colWidth)
      d.close()
    })
  }

  getRawData(rigs:any[],details:boolean){
    var isNumber = function isNumber(value:any) 
    {
      return typeof value === 'number' && isFinite(value);
    }
    let temp:any[]=[]
    let length:number=rigs.length
    let check:number=0
    return new Promise(res=>{
      rigs.forEach(a=>{
        firebase.database().ref('Hours').child(a.sn).once('value',s=>{
            firebase.database().ref('Categ').child(a.sn).once('value',h=>{
              if(s.val()!=null){
                let dates=Object.keys(s.val())
                let datesLen = dates.length
                let dateI=moment(convertDate(Object.keys(s.val())[0]))
                let dateF=moment(convertDate(Object.keys(s.val())[datesLen-1]))
                let hrsI:any=Object.values(s.val())[0]
                let hrsF:any=Object.values(s.val())[datesLen-1]
                let diff=dateF.diff(dateI, 'days')
                let avgE=diff>0?((parseInt(hrsF.orem=='c'?0:hrsF.orem)-parseInt(hrsI.orem=='c'?0:hrsI.orem))/diff*365):0
                let avgP1=diff>0?((parseInt(hrsF.perc1=='c'?0:hrsF.perc1)-parseInt(hrsI.perc1=='c'?0:hrsI.perc1))/diff*365):0
                let avgP2=diff>0?((parseInt(hrsF.perc2=='c'?0:hrsF.perc2)-parseInt(hrsI.perc2=='c'?0:hrsI.perc2))/diff*365):0
                let avgP3=diff>0?((parseInt(hrsF.perc3=='c'?0:hrsF.perc3)-parseInt(hrsI.perc3=='c'?0:hrsI.perc3))/diff*365):0
                if(details){
                  s.forEach(g=>{
                    let da = g.key!
                    temp.push({
                      Type: 'Read',
                      Div:h.val().div,
                      Segment: h.val().segment,
                      Fam:h.val().fam,
                      SubCat:h.val().subCat,
                      Date:new Date(parseInt(da.substring(0,4)),parseInt(da.substring(4,6))-1,parseInt(da.substring(6,8))),
                      Eng:g.val().orem?(g.val().orem=='c'?0:parseInt(g.val().orem)):0,
                      Perc1:g.val().perc1?(g.val().perc1=='c'?0:parseInt(g.val().perc1)):0,
                      Perc2:g.val().perc2?(g.val().perc2=='c'?0:parseInt(g.val().perc2)):0,
                      Perc3:g.val().perc3?(g.val().perc3=='c'?0:parseInt(g.val().perc3)):0,
                      Eng_avg:'',
                      Perc1_avg:'',
                      Perc2_avg:'',
                      Perc3_avg:'',
                      Sn:a.sn,
                      Model: a.model,
                      Customer: a.customer,
                      Site: a.site,
                      Prov: a.site.substring(a.site.length-3,a.site.length-1)
                    })
                  })
                  temp.push({
                    Type:'Avg',
                    Div:h.val().div,
                    Segment: h.val().segment,
                    Fam:h.val().fam,
                    SubCat:h.val().subCat,
                    Date:'',
                    Eng:'',
                    Perc1:'',
                    Perc2:'',
                    Perc3:'',
                    Eng_avg:isNumber(avgE)?parseInt(avgE.toFixed(0)):0,
                    Perc1_avg:isNumber(avgP1)?parseInt(avgP1.toFixed(0)):0,
                    Perc2_avg:isNumber(avgP2)?parseInt(avgP2.toFixed(0)):0,
                    Perc3_avg:isNumber(avgP3)?parseInt(avgP3.toFixed(0)):0,
                    Sn:a.sn,
                    Model: a.model,
                    Customer: a.customer,
                    Site: a.site,
                    Prov: a.site.substring(a.site.length-3,a.site.length-1)
                  })
                } else {
                  temp.push({
                    Type:'Avg',
                    Div:h.val().div,
                    Segment: h.val().segment,
                    Fam:h.val().fam,
                    SubCat:h.val().subCat,
                    Eng_avg:isNumber(avgE)?parseInt(avgE.toFixed(0)):0,
                    Perc1_avg:isNumber(avgP1)?parseInt(avgP1.toFixed(0)):0,
                    Perc2_avg:isNumber(avgP2)?parseInt(avgP2.toFixed(0)):0,
                    Perc3_avg:isNumber(avgP3)?parseInt(avgP3.toFixed(0)):0,
                    Sn:a.sn,
                    Model: a.model,
                    Customer: a.customer,
                    Site: a.site,
                    Prov: a.site.substring(a.site.length-3,a.site.length-1)
                  })
                }
              }
            })
            .then(()=>{
              check++
              if(check==length) res(temp)
            })
        })
      })
    })
  }


}


function convertDate(a:string){
  let b:any[]= a.split('')
  b.splice(4,0,'-')
  b.splice(7,0,'-')
  return new Date(b.join(''))
}