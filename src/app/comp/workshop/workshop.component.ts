import { Component, HostListener, OnInit } from '@angular/core';
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

@Component({
  selector: 'episjob-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {
  allow:boolean=false
  pos:string=''
  subPos:string=''
  list:any[]=[]
  filtro:string=''
  sortedData:any[]=[]
  displayedColumns:string[]=[]
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private dialog: MatDialog, private clip:Clipboard) { }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<550){
      this.displayedColumns=['file','SJ','add','archive','report']
    } else{
      this.displayedColumns=['file','SJ','model','customer','add','archive','report']
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('ws',this.pos, this.subPos)
          }, 1);
        }
      })
    )
    this.loadFiles()
  }
  
  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadFiles(){
    firebase.database().ref('wsFiles').child('open').on('value',a=>{
      this.list=[]
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            this.list.push(c.val())
          })
        })
      }
      this.sortedData=this.list.slice()
      this.fil(this.filtro)
    })
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
        default:
          return 0;
      }
    });
  }

  fil(b:any){
    this.filtro=b.toLowerCase()
    if(this.filtro){
      this.sortedData=this.list.filter(a=>{
        if(a.customer.toLowerCase().includes(this.filtro) || a.file.toLowerCase().includes(this.filtro) || a.model.toLowerCase().includes(this.filtro) || a.sn.toLowerCase().includes(this.filtro)) return a
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
          this.clip.copy(exp)
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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}