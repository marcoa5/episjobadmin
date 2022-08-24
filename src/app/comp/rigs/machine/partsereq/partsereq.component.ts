import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { environment } from 'src/environments/environment';
import { PartsdialogComponent } from './partsdialog/partsdialog.component';

@Component({
  selector: 'episjob-partsereq',
  templateUrl: './partsereq.component.html',
  styleUrls: ['./partsereq.component.scss']
})
export class PartsereqComponent implements OnInit {
  @Input() _reqlist:any[]=[]
  @Input() pos:string=''
  @Input() sortParts:boolean=true
  @Input() sortP:number=0
  inizio: number = 0
  fine: number = 5
  __reqlist:any[]=[]
  reqlist:any[]=[]
  sortedData:any[]=[]
  displayedColumns: string[]=['Date', 'Author', 'Amount']
  constructor(private http: HttpClient, private getH: GetquarterService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.__reqlist=this._reqlist
    .map(a=>{
      let partArr:string[]=[]
      a.Parts.forEach((e:any) => {
        partArr.push(e.pn)
      })  
      let url:string = environment.url
      let params = new HttpParams()
      .set('child',this.getH.getQ(a.date))
      .set("parts",partArr.toString())
      this.http.get(url + 'psdllp',{params:params}).subscribe(gt=>{
        let total:any=0
        a.Parts.forEach((fr:any)=>{
          let index = Object.values(gt).map(y=>{return y.pn}).indexOf(fr.pn)
          if(index>-1) {
            fr.llp=Object.values(gt)[index].llp
            fr.tot=Math.round(fr.llp * fr.qty*100)/100
            total+=fr.tot
          }
        })
        a.Parts['totAmount']=parseFloat(total)
      })
      //a.date = moment(a.date).format('DD/MM/YY')
      return a
    })
    .sort((a: any, b: any) => {
      if (a.date < b.date) {
        return 1;
      } else if (a.date > b.date) {
        return -1;
      } else {
        return 0;
      }
    });
    this.reqlist=this.__reqlist.slice(this.inizio,this.fine)
  }

  ngOnChanges(){
    if(this.sortP==1){
      this.__reqlist.reverse()
      this.reqlist=this.__reqlist.slice(this.inizio,this.fine)
    }
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this.reqlist = this.__reqlist.slice(this.inizio,this.fine)
  }

  open(a:any){
    let id:string = a.sn + '/' + a.reqId
    const dialogRef = this.dialog.open(PartsdialogComponent, {panelClass: 'parts-dialog', data: {parts:a.Parts, id: id}})
    dialogRef.afterClosed().subscribe(a=>{
      //if(a) window.location.reload()
    })
  }

  sortData(sort: Sort) {
    const data = this._reqlist.slice();
    if (!sort.active || sort.direction === '') {
      this.reqlist = data;
      return;
    }

    this.reqlist = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Date':
          return compare(a.date, b.date, isAsc);
        case 'Author':
          return compare(a.author, b.author, isAsc);
        case 'Amount':
          return compare(a.Parts.totAmount, b.Parts.totAmount, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}