import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import * as moment from 'moment'
import * as XLSX from 'xlsx'
import { HttpClient, HttpParams } from '@angular/common/http'
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'episjob-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('contT') 
  contT:ElementRef|undefined
  rigs:any[]=[]
  mac: any
  length:number=0
  ch:number=0
  isThinking: boolean=false
  machineData:any=[]
  isMobile:boolean=true
  displayedColumns:any=['Serial Number', 'Item Number','Model','Company','Site','Engine Hrs','Service Int', 'Service Step','Hours to next service','.', 'Service pred date','Prev day hours' ]
  constructor(private http: HttpClient, private clip: Clipboard) { }

  ngOnInit(): void {
    this.onResize()
  }

  all(){
    this.export()
    .then(()=>{
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.table_to_sheet(document.getElementById('ex'))
      XLSX.utils.book_append_sheet(wb,ws)
      var cell=[]
      for(let i = 0; i<10;i++){
        cell.push({c: i, r:0, wch:20})
      }
      ws['!cols'] = cell
      let nome = moment(new Date()).format('YYYYMMDDhhmmss')
      XLSX.writeFile(wb,`Export ${nome}.xlsx`)
    })
  }

  export(){
    return new Promise((res,rej)=>{
      firebase.database().ref('MOL').once('value',async a=>{
        let r = Object.keys(a.val())
        this.length = r.length
        await Object.keys(a.val()).map(async b=>{
          await firebase.database().ref('Hours/'+b).once('value',c=>{
            let g, lastread, ore:any
            if (c.val()!=null) {
              ore = Object.values(c.val())[0]
              g = Object.keys(c.val())[0]
              let f = `${g.substring(0,4)}-${g.substring(4,6)}-${g.substring(6,8)}`
              lastread = moment(new Date(f)).format('DD/MM/YYYY')
            }
            this.rigs.push({
              sn: a.val()[b].sn,
              in: a.val()[b].in,
              site: a.val()[b].site,
              model: a.val()[b].model,
              customer: a.val()[b].customer,
              lastread: lastread?lastread:'',
              orem: lastread?(ore.orem==''||ore.orem==undefined?'0':ore.orem):'0',
              perc1: lastread?(ore.perc1==''||ore.perc1==undefined?'0':ore.perc1):'0',
              perc2: lastread?(ore.perc2==''||ore.perc2==undefined?'0':ore.perc2):'0',
              perc3: lastread?(ore.perc3==''||ore.perc3==undefined?'0':ore.perc3):'0',
            })
            this.ch+=1
            if (this.ch == this.length) res('ok')
          })
        })
      })
    })
  }

  certiq(){
    if(!this.isMobile){
    this.machineData=[]
    this.isThinking=true
    let params = new HttpParams().set("day",moment(new Date()).format('YYYY-MM-DD'))
    this.http.get('https://episjobreq.herokuapp.com/certiq/'/*http://localhost:3001/certiq/'*/,{params:params}).subscribe(a=>{
      if(a){
        let b = Object.values(a)
        let d=b.filter(el=>{
          if(el.machineSerialNr!=undefined) return el
          return false
        })
        d.map((fa: any)=>{
          if(fa.serviceStep % 1500==0) {
            fa.serviceStepABC = 'C - 1.500'
          } else if(fa.serviceStep % 500==0) {
            fa.serviceStepABC = 'B - 500'
          } else if(fa.serviceStep % 250==0) {
            fa.serviceStepABC = 'A - 250'
          } else {
            fa.serviceStepABC = ''
          }
          if(fa.serviceStep>0) fa.machineHrs = fa.serviceStep - fa.hoursLeftToService
        })
        this.isThinking=false
        this.machineData=d
      }
    })
    }
  }

  onResize(){
    if(window.innerWidth<100) {
      this.isMobile=true
    } else {
      this.isMobile=false
    }
  }

  tableCopy(){
    let table:string=this.displayedColumns.toString().replace(/,/g,'\t') + '\n'
    //['Serial Number', 'Item Number','Model','Company','Site','Engine Hrs','Service Int', 'Service Step','Hours to next service', 'Service pred date','Prev day hours' ]
    this.machineData.forEach((e:any)=>{
      console.log(e.serviceStep)
      e.machineSerialNr!=undefined? table += e.machineSerialNr.toString() + '\t' : '\t'
      e.machineItemNumber!=undefined? table += e.machineItemNumber.toString() + '\t' :'\t'
      e.machineItemNumber!=undefined? table += e.machineModel.toString() + '\t' :'\t'
      e.machineCompany!=undefined? table += e.machineCompany.toString() + '\t' : '\t'
      e.machineSite!=undefined? table += e.machineSite.toString() + '\t' : '\t'
      e.machineHrs!=undefined? table += e.machineHrs.toString() + '\t' : '\t'
      e.serviceStep!=undefined? table += e.serviceStep.toString() + '\t':'\t'
      e.serviceStepABC!=undefined? table += e.serviceStepABC.toString() + '\t': '\t'
      e.hoursLeftToService!=undefined? table += e.hoursLeftToService.toString() + '\t' : '\t'
      e.hoursLeftToService!=undefined? table += e.hoursLeftToService.toString() + '\t' : '\t'
      e.servicePredictedDate!=undefined? table += e.servicePredictedDate.toString() + '\t' :'\t'
      e.LastDayEngineHours!=undefined? table += e.LastDayEngineHours.toString() + '\t\n' : '\t'
    })
    /*Object.values(this.machineData).forEach((el:any)=>{
      table += Object.values(el).toString()+'\n'
    })*/
    setTimeout(() => {
      this.clip.copy(table.replace(/,/g,'\t'))
    }, 500);
   
  }
  
  sfondo(a:any){
    if(a<=50) return 'backCR'
    if(a>50 && a<=100) return 'backCY'
    if(a>100) return 'backCG'
    return ''
  }
}


