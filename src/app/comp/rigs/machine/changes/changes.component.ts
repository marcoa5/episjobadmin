import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { FiledialogComponent } from '../workshopfiles/filedialog/filedialog.component';
import { ChangeDetailComponent } from './change-detail/change-detail.component';

@Component({
  selector: 'episjob-changes',
  templateUrl: './changes.component.html',
  styleUrls: ['./changes.component.scss']
})
export class ChangesComponent implements OnInit {
  @Input() list:any[]=[]
  _list:any[]=[]
  inizio: number = 0
  fine: number = 5
  ascdesc:number=-1
  sortedData:any
  displayedColumns:string[]=['time', 'author', 'key']
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.list.sort((a:any,b:any)=>{
      if(a.min>b.min) return -1
      if(a.min<b.min) return 1
      return 0
    })
    this._list=this.list.slice(this.inizio,this.fine)
  }

  ngOnChanges(){
    
  }

  open(fileData:any){
    const r = this.dialog.open(ChangeDetailComponent, {panelClass:'filedialog', data:fileData})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    //this._list = this.list.slice(this.inizio,this.fine)
  }

  sortData(sort: Sort) {
    const data = this.list.slice();
    if (!sort.active || sort.direction === '') {
      this._list = data;
      return;
    }

    this._list = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'time':
          return compare(a.time, b.time, isAsc);
        case 'author':
          return compare(a.author, b.author, isAsc);
        case 'key':
          return compare(a.key, b.key, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}