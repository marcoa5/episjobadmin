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
  displayedColumns:any=['Serial Number', 'Item Number','Model','Company','Site','Service Int', 'Service Step','Hours to next service', 'Service pred date','Prev day hours' ]
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
        })
        this.isThinking=false
        this.machineData=d
      }
    })
    }
    
  }

  onResize(){
    if(window.innerWidth<800) {
      this.isMobile=true
    } else {
      this.isMobile=false
    }
  }

  tableCopy(){
    let table:string=''
    Object.values(this.machineData).forEach((el:any)=>{
      table += Object.values(el).toString()+'\n'
    })
    setTimeout(() => {
      this.clip.copy(table.replace(/,/g,'\t'))
    }, 500);
   
  }
  
}


