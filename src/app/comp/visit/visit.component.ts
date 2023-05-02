import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { ExcelService } from 'src/app/serv/excelexport.service';
import { GetvisitreportService } from 'src/app/serv/getvisitreport.service';
import * as XLSX from 'xlsx-js-style'
import { MessageComponent } from '../util/dialog/message/message.component';
//import 'firebase/database'
//import 'firebase/auth'

@Component({
  selector: 'episjob-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  pos:string=''
  day: string=moment(new Date()).format('YYYY-MM-DD')
  userId:string=''
  ref:boolean=false
  allSpin:boolean=true
  allow:boolean=false
  subsList:Subscription[]=[]

  constructor(private dialog:MatDialog, private excel:ExcelService,private route:ActivatedRoute, private auth: AuthServiceService, private report:GetvisitreportService) {}

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a.day) this.day=a.day
    })
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.userId=a.uid
        setTimeout(() => {
          this.allow = this.auth.allow('SalesAll',this.pos)
          this.allSpin=false
        }, 1);
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }
  

  chDay(e:any){
    this.day=e
  }

  refresh(e:any){
    if(e=='ref'){
      let prev = this.day
      this.day=''
      setTimeout(() => {
        this.day=prev
      }, 10);
    } else {
      this.day=e
    }
    
    
  }

  downloadReport(){
    this.report.loadReportData()
    .then((res:any)=>{
      if(res.length==0) {
        this.dialog.open(MessageComponent, {data:{title:'Error',msg:'No data for this period'}})
      } else {
        let resLen:number=res.length
        let resIndex:number=0
        new Promise(ret=>{
          res.forEach((r:any)=>{
            r.date=new Date(r.date)
            r.Date = r.date
            r.Author = r.sam
            r.CustomerName = r.c1
            r.Place = r.place
            if(r.cusAtt) r.cusAtt=r.cusAtt.toString()
            r.CustomerAttendees=r.cusAtt
            delete r.cusAtt
            delete r.date
            delete r.place
            delete r.sam
            //delete r.notes
            delete r.c1
            delete r.cuId
            delete r.c2
            delete r.c3
            new Promise(rf=>{
              if(r.epiAtt) {
                let epi:string=''
                let len=r.epiAtt.length
                let index:number=0
                new Promise(reo=>{
                  r.epiAtt.forEach((e:any)=>{
                    epi+=(epi==''?'':',')+e.name
                    index++
                    if(index==len) reo('')
                  })
                })
                .then(()=>{
                  r.OtherEpirocAttendees=epi
                  delete r.epiAtt
                  rf('')
                })
              } else {
                r.OtherEpirocAttendees=''
                rf('')
              }
            })
            .then(()=>{
              r.Notes = r.notes
              delete r.notes
              resIndex++
              if(resIndex==resLen)  ret('')
            })
            
          })
        })
        .then(()=>{
          let name='Visit Report'
          let cols:string[]=['Date']
          let colWidth:any[]=[120,150,150,150,150,150,2000]
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res)
          let range=XLSX.utils.decode_range(worksheet['!ref']!)
          let Sheets:any={}
          Sheets[name]=worksheet
          const workbook: XLSX.WorkBook = { 
            Sheets, 
            SheetNames: [name] 
          }
          this.excel.exportAsExcelFile(workbook,name,cols,colWidth)
        })  
      } 
    })
  }
}
