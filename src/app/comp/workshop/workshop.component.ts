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
import { GenericComponent } from '../util/dialog/generic/generic.component';
import { CopyComponent } from '../util/dialog/copy/copy.component';
import { SelectmonthComponent } from './selectmonth/selectmonth.component';
import { ArchivedialogComponent } from './archivedialog/archivedialog.component';
import { SjnumberdialogComponent } from './sjnumberdialog/sjnumberdialog.component';
import { GetworkshopreportService } from 'src/app/serv/getworkshopreport.service';

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

  constructor(private auth: AuthServiceService, private dialog: MatDialog, private clip:Clipboard, private exp:GetworkshopreportService) { }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<850){
      if(this.type=='f') this.displayedColumns=['file','SJ','ws','add','archive']
      if(this.type=='a') this.displayedColumns=['file','SJ','ws']
    } else{
      if(this.type=='f') this.displayedColumns=['file','SJ','filenr','ws','model','customer','hrs','year','month','add','report','tot','archive']
      if(this.type=='a') this.displayedColumns=['file','SJ','filenr','ws','model','customer','hrs','report','tot']
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
    }, 10000);
  }

  ngOnChanges(){
    this.sortedData=this.list.slice()
    this.fil(this.filter)
    if(this.list.length>0) {
      this.spin=false
      //if(this.type=='f') this.calcCurrMonth().then(a=>console.log(a))
    }

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
    if(this.filter){
      this.sortedData=this.list.filter(a=>{
        if(a.fileNr.toLowerCase().includes(this.filter) ||a.sj.toLowerCase().includes(this.filter) ||a.ws.toLowerCase().includes(this.filter) || a.customer.toLowerCase().includes(this.filter) || a.file.toLowerCase().includes(this.filter) || a.model.toLowerCase().includes(this.filter) || a.sn.toLowerCase().includes(this.filter)) return a
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

  archive(e:any){
    const arc = this.dialog.open(ArchivedialogComponent, {data:{file:e.file}})
    arc.afterClosed().subscribe(a=>{
      if(a){
        firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).once('value',h=>{
          firebase.database().ref('wsFiles').child('archived').child(e.sn).child(e.id).set(h.val())
        }).then(()=>{
          firebase.database().ref('wsFiles').child('open').child(e.sn).child(e.id).remove()
        })
      }
    })
  }

  report(a:any){
    const mese = this.dialog.open(SelectmonthComponent, {data:''})
    mese.afterClosed().subscribe(da=>{
      if(da){
        let dy=da.getDay()==0?7:da.getDay()
        console.log(dy)
        const dia = this.dialog.open(GenericComponent,{data:{msg:'Exporting data...'}})
        setTimeout(() => {
          dia.close()
        }, 10000);
        let exp:string=''
        firebase.database().ref('wsFiles').child('open').child(a.sn).child(a.id).once('value',p=>{
          //exp=`\t${p.val().file}\n${p.val().model}\n${p.val().customer}\n\n${'GIORNO'}\t${'DATA'}\t${'V1'}\t${'V2'}\t${'V8'}\n`
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
                  exp+=`${day.toUpperCase()}\t${moment(m1).add(i,'days').format('DD-MM-YYYY')}\t${k.val().v1?k.val().v1:''}\t${k.val().v2?k.val().v2:''}\t${k.val().v8?k.val().v8:''}\n`
                } else {
                  exp+=`${day.toUpperCase()}\t${moment(m1).add(i,'days').format('DD-MM-YYYY')}\t\t\t\n`
                }
              })
            }
          }
        }).then(()=>{
          this.clip.copy(exp.replace(/[.]/g,','))
          const dd = this.dialog.open(CopyComponent)
          dia.close()
        })
      }
    })
    /*
    */
  }

  go(a:any,b:any){
    
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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}