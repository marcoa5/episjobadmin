import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service'
import firebase from 'firebase/app';
import * as moment from 'moment'
import { Sort } from '@angular/material/sort';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component'
import { Router } from '@angular/router';
import { ArchivecontractdialogComponent } from './archivecontractdialog/archivecontractdialog.component'
import { ExcelService } from 'src/app/serv/excelexport.service';
import { AttachService } from 'src/app/serv/attach.service';

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
  @Input() contractList:cont[]=[]
  sortedData:cont[]=[]

  displayedColumns:string[]=[]
  subsList:Subscription[]=[]
  constructor(private attach:AttachService, private excel:ExcelService, private router:Router, private auth:AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {3
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          this.onResize()
        }
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  ngOnChanges(){
    this.sortedData=this.contractList.slice()
    if(this.sortedData.length>0) this.allSpin=false
    this.sortData({active:'left',direction:'asc'})
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<800) {
      this.displayedColumns=['sn','type','attachment','edit','delete']
    } else {
      this.displayedColumns=['sn','model','customer','type','start','end','left','attachment','edit','delete','archive']
    }
    if(this.pos!='SU' && this.pos!='admin' && this.pos!='adminS'){
      let i:number=0
      i=this.displayedColumns.indexOf('edit')
      if(i>=0) this.displayedColumns.splice(i,1)
      let j:number=0
      j=this.displayedColumns.indexOf('delete')
      if(j>=0) this.displayedColumns.splice(j,1)
      let k:number=0
      k=this.displayedColumns.indexOf('archive')
      if(k>=0) this.displayedColumns.splice(k,1)
    }
  }

  

  filter(c:any){
    let a:string=c.toLowerCase()
    console.log(a)
    this.sortedData=this.contractList.filter((b:any)=>{
      if(b.sn.toLowerCase().includes(a) || b.model.toLowerCase().includes(a) || b.customer.toLowerCase().includes(a) || b.type.toLowerCase().includes(a)) return true
      return false
    })
    this.sortData({active:'left',direction:'asc'})

  }

  /*add(e?:any){
    const dia = this.dialog.open(NewcontractComponent, {panelClass:'contract',data:{new:e?false:true,info:e?e:undefined}})
    dia.afterClosed().subscribe(res=>{
      if(res!=undefined){
        this.attach(res)
      }
    })
  }*/

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
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
      if(a) firebase.database().ref('Contracts').child('active').child(i.sn).child(i.type).remove()
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

  att(e:any){
    this.attach.attach(e)
  }

  add(e?:any){
    this.attach.add(e)
  }
  /*attach(e:any){
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
  }*/

  openRig(a:string){
    this.router.navigate(['machine', {sn:a}])
  }

  openCust(a:string){
    this.router.navigate(['cliente',{id:a}])
  }

  archive(el:any){
    const dia=this.dialog.open(ArchivecontractdialogComponent,{data:el})
    dia.afterClosed().subscribe(res=>{
      if(res){
        firebase.database().ref('Contracts').child('active').child(el.sn).child(el.type).once('value',a=>{
          if(a.val()){
            firebase.database().ref('Contracts').child('archived').child(el.sn).child(el.type).set(a.val())
            .then(()=>{
              firebase.database().ref('Contracts').child('active').child(el.sn).remove()
              .then(()=>{
                firebase.database().ref('Updates').child('ContractsArchupd').set(moment(new Date()).format('YYYYMMDDHHmmss'))
              })
            })
          }
        })
      }
    })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}