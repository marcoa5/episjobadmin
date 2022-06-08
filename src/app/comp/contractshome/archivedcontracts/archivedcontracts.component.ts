import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { AttachmentdialogComponent } from '../contracts/attachmentdialog/attachmentdialog.component';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-archivedcontracts',
  templateUrl: './archivedcontracts.component.html',
  styleUrls: ['./archivedcontracts.component.scss']
})
export class ArchivedcontractsComponent implements OnInit {
  sortedData:any[]=[]
  displayedColumns:string[]=[]
  @Input() archivedList:any[]=[]
  constructor(private router:Router, private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(){
    this.onResize()
    this.sortedData=this.archivedList.slice()
    this.sortData({active:'left',direction:'asc'})
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<800) {
      this.displayedColumns=['sn','type','attachment']
    } else {
      this.displayedColumns=['sn','model','customer','type','start','end','attachment']
    }
  }

  filter(c:any){
    let a:string=c.toLowerCase()
    this.sortedData=this.archivedList.filter((b:any)=>{
      if(b.sn.toLowerCase().includes(a) || b.model.toLowerCase().includes(a) || b.customer.toLowerCase().includes(a) || b.type.toLowerCase().includes(a)) return true
      return false
    })
  }

  sortData(sort: Sort) {
    const data = this.archivedList.slice();
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

  openRig(a:string){
    this.router.navigate(['machine', {sn:a}])
  }

  openCust(a:string){
    this.router.navigate(['cliente',{id:a}])
  }

  attach(e:any){
    if(e.att>0){
      let wait = this.dialog.open(GenericComponent, {data: {msg:'Looking for attachments...'}})
      setTimeout(() => {
        wait.close()
      }, 10000);
      let dia:MatDialogRef<AttachmentdialogComponent,any>
      firebase.storage().ref('Contracts').child(e.id).listAll().then(list=>{
        if(list) wait.close()
        if(list.items.length==0) {
          dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:'new',arch:true}})
        } else {
          dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:list.items,arch:true}})
        }
      })   
    } 
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}