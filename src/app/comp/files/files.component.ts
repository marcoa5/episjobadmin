import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import{ BackService } from '../../serv/back.service'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericComponent } from '../util/dialog/generic/generic.component';
import * as XLSX from 'xlsx-js-style'
import { ExcelService } from 'src/app/serv/excelexport.service';

@Component({
  selector: 'episjob-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  files:any[]=[]
  files1:any[]=[]
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  start:number=-1
  end:number=0
  lungh:number[]=[10,25,50,100]
  pos:string=''
  allow:boolean=false
  //auth:string[]=[]
  allSpin:boolean=true
  subsList:Subscription[]=[]

  constructor(private excel:ExcelService, private auth: AuthServiceService, private bak: BackService, private paginator:MatPaginatorIntl, public route: ActivatedRoute, private clip: Clipboard, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = '#'
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('TechInt',this.pos)
          this.allSpin=false
        }, 1);
      })
    )
    firebase.storage().ref('Closed').listAll()
    .then(a=>{
      a.items.map(async b=>{
          let f = {name:b.name}
          this.files.push(f)
          if (this.files.length==a.items.length){
            await this.files.reverse()
            this.lungh.push(this.files.length)
            this.start=0
            this.end=10
            this.files1 = this.files.slice(this.start,this.end)
          }
      })
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }
  
  open(a:string){
    firebase.storage().ref('Closed').child(a).getDownloadURL()
    .then(b=>{
      window.open(b)
    })
    
  }

  filter(a:any){
    if(a!=''){
      this.filtro=a
      this.files1 = this.files.slice()
    } else {
      this.filtro=''
      this.start=1
      this.end =10
      this.files1 = this.files.slice(0,10)
    }
  }

  pageEvent(e:any){
    this.start = e.pageIndex * e.pageSize 
    this.end = e.pageIndex* e.pageSize + e.pageSize
    this.files1=this.files.slice(this.start,this.end)
  }

  survey(e:any){
    const dia = this.dialog.open(GenericComponent, {data: {msg: 'Collecting information'}})
    setTimeout(() => {
      dia.close()
    }, 10000);
    let str:any[] = []//`\\t\t\t\t\t\t`
    firebase.database().ref('Saved').once('value',a=>{
      a.forEach(b=>{
        b.forEach(c=>{
          if(c.val().tecnico11!=undefined && isFinite(parseInt(c.val().rissondaggio.split('')[0]))) {
            let dd=new Date(c.val().data11.substring(6,10),c.val().data11.substring(3,5),c.val().data11.substring(0,2))
            str.push({
              Technician:c.val().tecnico11,
              Date:dd,
              Customer:c.val().cliente11,
              Machine:c.val().prodotto1,
              Serialnr:c.val().matricola,
              Planning:c.val().rissondaggio.split('')[0],
              Deliveries:c.val().rissondaggio.split('')[1],
              Execution:c.val().rissondaggio.split('')[2]
            })
          }
        })
      })
    }).then(()=>{
      str.sort((a:any,b:any)=>{
        if(a.Date>b.Date) return 1
        if(a.Date<b.Date) return -1
        return 0
      })
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(str);
      let range=XLSX.utils.decode_range(worksheet['!ref']!)

      //Center columns
      let cols:string[]=[
        'Originator',
        'Date',
        'Serialnr',
        'Planning',
        'Deliveries',
        'Execution'
      ]

      let colWidth:any[]=[120,120,120,120,120,60,60,60]

      //columns Width
      
      let Sheets:any={}
      Sheets['Files']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['Files'] 
      }
      this.excel.exportAsExcelFile(workbook,'Service Jobs List',cols,colWidth)
      dia.close()
    })
  }
}
