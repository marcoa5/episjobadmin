import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewcontractComponent } from './newcontract/newcontract.component';
import firebase from 'firebase/app';
import * as moment from 'moment';
import { ContractalreadyexistsdialogComponent } from './contractalreadyexistsdialog/contractalreadyexistsdialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface cont {
  sn: string;
  model: number;
  customer: number;
  type: string;
  start: string;
  end: string;
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

  displayedColumns:string[]=['sn','model','customer','type','start','end']
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('contracts',this.pos)
        }, 1);
      })
    )
    setTimeout(() => {
      this.allSpin=false
    }, 1000);
    this.loadContracts()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadContracts(){
    firebase.database().ref('Contracts').on('value',a=>{
      this.contractList=[]
      a.forEach(b=>{
        b.forEach(c=>{
          this.contractList.push(c.val())
        })
      })
      this.sortedData=this.contractList.slice()
    })
  }

  filter(a:any){
    this.filtro=a
  }

  add(e:any){
    const dia = this.dialog.open(NewcontractComponent, {panelClass:'contract',data:{new:true}})
    dia.afterClosed().subscribe(res=>{
      if(res!=undefined){
        res.start = moment(res.start).format('YYYY-MM-DD')
        res.end = moment(res.end).format('YYYY-MM-DD')
        firebase.database().ref('Contracts').child(res.sn).child(res.type).set(res)
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
        default:
          return 0;
      }
    });
  }
  
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}