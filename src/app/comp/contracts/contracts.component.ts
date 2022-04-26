import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewcontractComponent } from './newcontract/newcontract.component';
import firebase from 'firebase/app';
import * as moment from 'moment';
import { ContractalreadyexistsdialogComponent } from './contractalreadyexistsdialog/contractalreadyexistsdialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { AttachmentdialogComponent } from './attachmentdialog/attachmentdialog.component';
import { GenericComponent } from '../util/dialog/generic/generic.component';

export interface cont {
  sn: string;
  model: number;
  customer: number;
  type: string;
  start: string;
  end: string;
  daysleft:number;
}


@Component({
  selector: 'episjob-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  filtro:string=''
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  contractList:cont[]=[]
  sortedData:cont[]=[]

  displayedColumns:string[]=['sn','model','customer','type','start','end','attachment','edit','delete']
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          if(this.pos!='SU' && this.pos!='admin' && this.pos!='adminS'){
            let i:number=0
            i=this.displayedColumns.indexOf('edit')
            if(i>=0) this.displayedColumns.splice(i,1)
            let j:number=0
            j=this.displayedColumns.indexOf('delete')
            if(j>=0) this.displayedColumns.splice(j,1)
          }
        }
        setTimeout(() => {
          this.allow=this.auth.allow('contracts',this.pos)
        }, 1);
      })
    )
    setTimeout(() => {
      this.allSpin=false
    }, 1000);
    this.loadContracts()
    this.onResize()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<800) {
      this.displayedColumns=['sn','type','attachment','edit','delete']
    } else {
      this.displayedColumns=['sn','model','customer','type','start','end','left','attachment','edit','delete']
    }
  }

  loadContracts(){
    firebase.database().ref('Contracts').on('value',a=>{
      this.contractList=[]
      a.forEach(b=>{
        b.forEach(c=>{
          c.forEach(d=>{
            let g=d.val()
            g.daysleft=this.chDate(d.val().end)
            this.contractList.push(g)
          })
        })
      })
      this.sortedData=this.contractList.slice()
    })
  }

  filter(c:any){
    let a:string=c.toLowerCase()
    this.sortedData=this.contractList.filter((b:any)=>{
      if(b.sn.toLowerCase().includes(a) || b.model.toLowerCase().includes(a) || b.customer.toLowerCase().includes(a) || b.type.toLowerCase().includes(a)) return true
      return false
    })
  }

  add(e?:any){
    const dia = this.dialog.open(NewcontractComponent, {panelClass:'contract',data:{new:e?false:true,info:e?e:undefined}})
    dia.afterClosed().subscribe(res=>{
      if(res!=undefined){
        console.log(res)
        res.start = moment(res.start).format('YYYY-MM-DD')
        res.end = moment(res.end).format('YYYY-MM-DD')
        firebase.database().ref('Contracts').child(res.sn).child(res.type).child(res.id).set(res)
        .then(()=>{
          this.attach(res)
        })
      }
    })
  }

  sortData(sort: Sort) {
    const data = this.contractList.slice();
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
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'start':
          return compare(a.start, b.start, isAsc);
        case 'end':
          return compare(a.end, b.end, isAsc);
        case 'left':
          return compare(a.daysleft, b.daysleft, isAsc);
        default:
          return 0;
      }
    });
  }

  delete(i:any){
    const dia = this.dialog.open(DeldialogComponent,{data:{id:'contract',desc:i.type + ' on s/n ' + i.sn + ' and all attachments'}})
    dia.afterClosed().subscribe(a=>{
      if(a) firebase.database().ref('Contracts').child(i.sn).child(i.type).remove()
      .then(()=>{
        firebase.storage().ref('Contracts').child(i.id).listAll()
        .then(f=>{
          f.items.forEach(t=>{
            t.delete()
          })
        })
        .catch(err=>console.log(err))
      })
    })
  }

  attach(e:any){
    let wait = this.dialog.open(GenericComponent, {data: {msg:'Looking for attachments...'}})
    setTimeout(() => {
      wait.close()
    }, 10000);
    let dia:MatDialogRef<AttachmentdialogComponent,any>
    firebase.storage().ref('Contracts').child(e.id).listAll().then(list=>{
      if(list) wait.close()
      if(list.items.length==0) {
        dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:'new'}})
      } else {
        dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:list.items}})
      }
    })    
  }

  chDate(a:any){
    let da = moment(new Date(a))
    let today = moment(new Date())
    return da.diff(today,'days')
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}