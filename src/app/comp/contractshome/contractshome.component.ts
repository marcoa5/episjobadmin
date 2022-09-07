import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import * as moment from 'moment'
import * as XLSX from 'xlsx-js-style'
import { ExcelService } from 'src/app/serv/excelexport.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttachService } from 'src/app/serv/attach.service';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

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
  constructor(private attach:AttachService, private dialog:MatDialog, private excel:ExcelService , private auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.pos
          setTimeout(() => {
            this.allow=this.auth.allow('Internal',this.pos)

          }, 1);
        }
      }),
      this.auth._contracts.subscribe(a=>{
        if(a.length>0) {
          this.contractsSpin=false
          this.contractList=a.slice()
        }
      }),
      this.auth._contractsArch.subscribe(a=>{
        if(a.length>0) {
          this.archivedSpin=false
          this.archivedList=a.slice()
        } else {
          this.archivedSpin=false
        }
      })
    )
    //this.loadArchived()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadContracts(list:any[]){
    this.contractList=list
    console.log(this.contractList)
    console.log('none')
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

  /*loadArchived(){
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
  }*/

  chDate(a:any){
    let da = moment(new Date(a))
    let today = moment(new Date())
    return da.diff(today,'days')
  }

  getDownload(){
    let list:any[]=this.contractList
    let output:any[]=[]
    let check:number=0
    let length:number=list.length
    new Promise(res=>{
      list.map((item:any, index:number)=>{
        let temp:any={}
        let keys = Object.keys(item).sort()
        keys.forEach(k=>{
          temp[k]=item[k]
        })
        delete temp['att']
        delete temp['id']
        delete temp['custCode']
        if(item.discounts){
          let newK=Object.keys(item.discounts)
          newK.forEach(a=>{
            let newVal:any=Object.values(item.discounts)[newK.indexOf(a)]
            if(a.substring(0,3)=='RDT' || a.substring(0,3)=='PSD') newVal=parseInt(newVal.toString())
            temp['disc_'+a]= newVal
          })
        }

        if(item.fees){
          let newK=Object.keys(item.fees)
          newK.forEach(a=>{
            let newVal:any=Object.values(item.fees)[newK.indexOf(a)]
            newVal=parseFloat(parseFloat(newVal.toString()).toFixed(2))
            temp['fees_'+a]= newVal
          })
        }
        temp['start']=new Date(temp['start'])
        temp['end']=new Date(temp['end'])
        delete temp['fees']
        delete temp['discounts']
        output.push(temp)
        check++
        if(check==length) res('')
      })
    })
    .then(()=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(output);
      //Center columns
      let cols:string[]=['daysleft','end','model','sn','start','disc_PSD Discount','disc_RDT discount','disc_air transport','disc_truck transport','fees_day','fees_km','fees_lump sum travel','fees_mf','fees_mnf','fees_mnt','fees_off','fees_ofs','fees_spo','fees_sps','fees_spv','fees_std','fees_str','fees_COP CARE','fees_ROC CARE','fees_ROC&COP CARE']
      let colWidth:any[]=[250,60,120,120,120,120,250]
      for (var i=0; i<21; i++) {
        colWidth.push(80);
      }
      let range=XLSX.utils.decode_range(worksheet['!ref']!)
      //columns Width
      for(let c=0;c<=range.e.c;c++){
        let cell=worksheet[XLSX.utils.encode_cell({r:0,c:c})]
        if(cell.v.substring(0,4)=='fees') {
          for(let r=1;r<=range.e.r;r++){
            let cell1=worksheet[XLSX.utils.encode_cell({r:r,c:c})]
            if(cell1) {
              cell1.z="#,##0.00"
            } else {
              let c1:any={}
                c1.v=''
                c1.t='n'
                c1.z="#,##0.00"
                worksheet[XLSX.utils.encode_cell({r:r,c:c})]=c1
            }
          }
        }
      }
      let Sheets:any={}
      Sheets['Contracts']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['Contracts'] 
      }
      this.excel.exportAsExcelFile(workbook,'List of Contracts',cols,colWidth)
    })
  }  

  add(){
    this.attach.add()
  }
}
