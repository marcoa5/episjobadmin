import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewfileComponent } from './newfile/newfile.component';
import firebase from 'firebase/app'
import { weekdays } from 'moment';
import { WeekdialogComponent } from './weekdialog/weekdialog.component';
import { Clipboard } from '@angular/cdk/clipboard'
import * as moment from 'moment';
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import * as XLSX from 'xlsx-js-style'
import { SelectmonthComponent } from './selectmonth/selectmonth.component';
import { ArchivedialogComponent } from './archivedialog/archivedialog.component';
import { SjnumberdialogComponent } from './sjnumberdialog/sjnumberdialog.component';
import { GetworkshopreportService } from 'src/app/serv/getworkshopreport.service';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/serv/excelexport.service';

@Component({
  selector: 'episjob-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {
  @Input() filter:string=''
  @Input() list:any[]=[]
  @Input() title:string=''
  @Input() pad:number=30
  @Input() type:string=''
  allow:boolean=false
  pos:string=''
  subPos:string=''

  ws:string=''
  sortedData:any[]=[]
  displayedColumns:string[]=[]
  subsList:Subscription[]=[]
  spin:boolean=true

  constructor(private excel:ExcelService, private router:Router, private auth: AuthServiceService, private dialog: MatDialog, private clip:Clipboard, private exp:GetworkshopreportService) { }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<850){
      if(this.type=='f') this.displayedColumns=['file','SJ','ws','add','archive']
      if(this.type=='a') this.displayedColumns=['file','SJ','ws']
    } else{
      if(this.type=='f') this.displayedColumns=['file','SJ','filenr','ws','model','customer','hrs','year','month','add','report','tot','archive']
      if(this.type=='a') this.displayedColumns=['file','SJ','filenr','ws','model','customer','hrs','tot']
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.ws=a.ws?a.ws:''
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('ws',this.pos, this.subPos)
          }, 1);
        }
      })
    )
    setTimeout(() => {
      this.spin=false
    }, 5000);
  }

  ngOnChanges(){
    let ch=this.list.length
    let index:number=0
    new Promise((res)=>{
      this.list.forEach(a=>{
        firebase.database().ref('wsFiles').child('sent').child(a.sn).child(a.id).child('days').on('value',k=>{
          if(k.val()!=null) { 
            a.temp=true
          } else {
            delete a.temp
          }
          index ++
          if(index==ch) res('')
        })
      })
    }).then(()=>{
      this.sortedData=this.list.slice()
      this.fil(this.filter)
      if(this.list.length>0) {
        this.spin=false

      }
    })
    
  }

  calcCurrMonth(){
    return new Promise(res=>{
      let ch:number=this.list.length
      let ind:number=0
      let sum:any={}
      this.list.forEach(a=>{
        if(a.monthsum>0){
          if(sum[a.ws]==undefined) sum[a.ws]=0
          sum[a.ws]+=a.monthsum 
        }
        ind++
        if(ind==ch) res(sum)
      })
    })
  }

  getTotalSum(){
    return this.sortedData.map(a=>a.hrs).reduce((a,b)=>a+b,0)
  }

  getYearlySum(){
    return this.sortedData.map(a=>a.yearsum).reduce((a,b)=>a+b,0)
  }

  getMonthlySum(){
    return this.sortedData.map(a=>a.monthsum).reduce((a,b)=>a+b,0)
  }
  
  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  add(e:any){
    const dia=this.dialog.open(NewfileComponent,{panelClass: 'attachment',data:{new:false}})
  }

  sortData(sort: Sort) {
    const data = this.list.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sn':
          return compare(a.sn, b.sn, isAsc);
        case 'model':
          return compare(a.model, b.model, isAsc);
        case 'customer':
          return compare(a.customer, b.customer, isAsc);
        case 'file':
          return compare(a.file, b.file, isAsc);
        case 'hrs':
          return compare(a.hrs, b.hrs, isAsc);
        case 'SJ':
          return compare(a.sj, b.sj, isAsc);
        case 'filenr':
          return compare(a.fileNr, b.fileNr, isAsc)
        case 'ws':
          return compare(a.ws, b.ws, isAsc)
        case 'month':
          return compare(a.monthsum, b.monthsum, isAsc)
        case 'year':
          return compare(a.yearsum, b.yearsum, isAsc)
        default:
          return 0;
      }
    });
  }

  fil(b:string){
    this.filter=b.toLowerCase()
    if(this.filter && this.filter.substring(0,1)=='*'){
      this.sortedData=this.list.filter(a=>{
        if(a.ws.toLowerCase().includes(this.filter.substring(1,1000))) return a
        return false
      })
    }else if(this.filter && this.filter.substring(0,1)!='*'){
      this.sortedData=this.list.filter(a=>{
        if(a.fileNr.toLowerCase().includes(this.filter) ||a.sj.toLowerCase().includes(this.filter) ||a.customer.toLowerCase().includes(this.filter) || a.file.toLowerCase().includes(this.filter) || a.model.toLowerCase().includes(this.filter) || a.sn.toLowerCase().includes(this.filter)) return a
        return false
      })
    } else {
      this.sortedData=this.list.slice()
    }

  }

  addHrs(e:any){
    const dia=this.dialog.open(WeekdialogComponent, {panelClass: 'contract', data:e})
    dia.afterClosed().subscribe(a=>{})
  }

  chPos(a:string,b?:string){
    if(b=='archive' && !this.auth.acc(a)){
      if(this.displayedColumns.indexOf('archive')>=0) this.displayedColumns.splice(this.displayedColumns.indexOf('archive'),1)
    
    }
    return this.auth.acc(a)
  }

  getFileSum(f:any){
    return new Promise((res,rej)=> {
      let gg:any[]=Object.keys(f.days)
      let sum:number=0
      let ch:number=gg.length
      let index:number=0
      gg.forEach(a=>{
        let b:any=Object.values(f.days)[Object.keys(f.days).indexOf(a)]
        sum+=(b.v1?b.v1:0)+(b.v2?b.v2:0)+(b.v8?b.v8:0)
        index++
        if(index==ch) {res(sum)}
      }) 
    })    
  }

  async archive(e:any){
    const hrs = await this.getFileSum(e)
    const arc = this.dialog.open(ArchivedialogComponent, {data:{file:e.file}})
    arc.afterClosed().subscribe(a=>{
      if(a){
        firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).once('value',h=>{
          let vals=h.val()
          vals.hrs=hrs
          firebase.database().ref('wsFiles').child('archived').child(e.sn).child(e.id).set(vals)
        }).then(()=>{
          firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).remove()
        })
      }
    })

  }

  report(a:any){
    this.exp.month(a)
    /*
    */
  }

  openSJNr(e:any){
    if(this.type=='f'){
      const d = this.dialog.open(SjnumberdialogComponent, {data:{info:e,title:'sj'}})
      d.afterClosed().subscribe(a=>{
        if(a){
          firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).child('sj').set(a)
        }
      })
    }
  }

  openFileNr(e:any){
    if(this.type=='f'){
      const d = this.dialog.open(SjnumberdialogComponent, {data:{info:e,title:'file'}})
      d.afterClosed().subscribe(a=>{
        if(a){
          firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).child('fileNr').set(a)
        }
      })
    }
  }

  total(e:any){
    this.exp.report(e)
  }

  goTo(route:string, key:string, val:string){
    let obj:any={}
    obj[key]=val
    this.router.navigate([route,obj])
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}