import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ExcelService } from 'src/app/serv/excelexport.service';
import * as XLSX from 'xlsx-js-style'
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
  constructor(private dialog: MatDialog, private excel:ExcelService) { }

  ngOnInit(): void {
    this._list=this.list.slice(this.inizio,this.fine)
  }

  ngOnChanges(){
    
  }

  createListForExport(){
    let exp:any[]=[]
    exp=this.list.slice()
    return new Promise(res=>{
      let length:number = this.list.length
      let index:number=0
      exp.forEach(l=>{
        delete l.time
        l.valNew=l.val.new
        l.valOld=l.val.old
        delete l.val
        index++
        if(index==length) res(exp)
      })
    })
  }

  exportList(){
    this.createListForExport()
    .then((list:any)=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(list);
      //Center columns
      let cols:string[]=['Author','Time','Key','OldValue','NewValue']
      let colWidth:any[]=[250,60,120,120,120,120,250]
      for (var i=0; i<21; i++) {
        colWidth.push(80);
      }
      let range=XLSX.utils.decode_range(worksheet['!ref']!)
      //columns Width
      for(let c=0;c<=range.e.c;c++){
        let cell=worksheet[XLSX.utils.encode_cell({r:0,c:c})]
        if(cell.v.substring(0,4)=='fees') {
          for(let r=1;r<=range.e.r;r++){
            let cell1=worksheet[XLSX.utils.encode_cell({r:r,c:c})]
            if(cell1) {
              cell1.z="#,##0.00"
            } else {
              let c1:any={}
                c1.v=''
                c1.t='n'
                c1.z="#,##0.00"
                worksheet[XLSX.utils.encode_cell({r:r,c:c})]=c1
            }
          }
        }
      }
      let Sheets:any={}
      Sheets['Contracts']=worksheet
      const workbook: XLSX.WorkBook = { 
        Sheets, 
        SheetNames: ['Contracts'] 
      }
      this.excel.exportAsExcelFile(workbook,'List of Contracts',cols,colWidth)
    })  
  }

  open(fileData:any){
    const r = this.dialog.open(ChangeDetailComponent, {panelClass:'filedialog', data:fileData})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
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