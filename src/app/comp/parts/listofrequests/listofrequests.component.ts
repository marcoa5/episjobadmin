import { Component, Input, OnInit, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import * as moment from 'moment';
import { DateconvPipe } from 'src/app/pipe/dateconv.pipe';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';

@Component({
  selector: 'episjob-listofrequests',
  templateUrl: './listofrequests.component.html',
  styleUrls: ['./listofrequests.component.scss']
})
export class ListofrequestsComponent implements OnInit {
  @Input() list: any[]=[]
  @Input() selected:number=0
  @Input() sent: boolean=false
  @Output() index = new EventEmitter()
  @Output() indexD=new EventEmitter()
  displayedColumns:string[]=['sn','model','customer','date','type','author','orig','del']
  sortedData:any[]=[]

  constructor(private dialog:MatDialog, private router: Router,private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.onResize()
  }

  ngOnChanges(){
    this.sortedData=this.list.slice()
    if(this.selected==-1){
      this.sortedData.forEach(a=>{
        a.sel=0
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<801){
      this.displayedColumns=['sn','date','orig']
    } else {
      this.displayedColumns=['sn','model','customer','date','type','author','orig']
    }
    if(this.sent) this.displayedColumns.push('del')
  }

  go(a:any, e:any){
    for(let l of this.list){
      if(this.list[a]!=l) l.sel=0
    }
    if(this.list[a].sel==0) {
      this.list[a].sel=1
      this.index.emit([a,this.list[a]])
    } else if(this.list[a].sel==1) {
      this.list[a].sel=0
      this.index.emit(-1)
    }
  }

  directgo(a:any){
    this.indexD.emit(a)
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
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'author':
          return compare(a.author, b.author, isAsc);
        case 'orig':
          return compare(a.orig, b.orig, isAsc);
        default:
          return 0;
      }
    });
  }
  
  select(e:any){
    if(e>=0){
      if(this.sortedData[e].sel==1) {
        this.sortedData[e].sel=0
        this.index.emit(-1)
      } else {
        this.sortedData.forEach(a=>{
          a.sel=0
        })
        this.sortedData[e].sel=1
        this.index.emit([e,this.sortedData[e]])
      }
    }
  }

  delete(e:any){
    let d = this.dialog.open(DeldialogComponent, {data:{name:'Parts request to ' + e.model + " " + e.sn + " (" + e.customer + ") on " + moment(e.date).format("DD/MM/YYYY")}})
    d.afterClosed().subscribe(res=>{
      if(res){
        firebase.database().ref('PartReqSent').child(e.sn).child(e.reqId).remove()
        .then(()=>{
          this._snackBar.open(res + " deleted",'',{duration:5000})
        })
      }
    })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}