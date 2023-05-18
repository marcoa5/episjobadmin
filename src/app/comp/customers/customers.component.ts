import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { BackService }  from '../../serv/back.service'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard'
import { ExportPotentialService } from 'src/app/serv/export-potential.service';
import * as XLSX from 'xlsx-js-style'
import { ExcelService } from 'src/app/serv/excelexport.service';

@Component({
  selector: 'episjob-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  filtro:any=''
  customers:any[]=[];
  _customers:any[]=[];
  pos:string='';
  ind:number=0
  custSales:string[]=[]
  rigSn:string[]=[]
  subsList:Subscription[]=[]

  constructor(private ePot: ExportPotentialService,public router: Router, public bak:BackService, private auth: AuthServiceService, private clip: Clipboard, private excel:ExcelService) {
    
  }

  ngOnInit() {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.ind=a.Area?.toString()
      }),
      this.auth._customers.subscribe(a=>{
        setTimeout(() => {
          this.customers=a
        }, 1);
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  open(a: String, b:string, c:string, d:string, e:any){
    if(e.ctrlKey){
      this.clip.copy(`${a}\n${b}\n${c}`)
    } else {
      if(navigator.onLine) this.router.navigate(['cliente',{id:d}])
    }
  }

  
  back(){
    this.bak.backP()
  }

  filter(a:any){
    this.filtro=a
  }  

  exportPot(){
    this.ePot.export().then((val:any)=>{
      let name='Potential'
      let cols:string[]=['']
      let colWidth:any[]=[180,250,60,60,60,60,60,60,60,60]
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(val)
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
  
}
