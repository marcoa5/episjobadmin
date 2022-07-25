import { Injectable } from '@angular/core'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx-js-style'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelService {
constructor() { }
public exportAsExcelFile(workbook:XLSX.WorkBook, excelFileName: string, columnsToBeCentered:string[],columnsWidth:number[]): void {
  workbook.SheetNames.forEach(a=>{
    let worksheet:XLSX.WorkSheet=workbook.Sheets[a]
    let range=XLSX.utils.decode_range(worksheet['!ref']!)
    worksheet['!cols']=[]
      columnsWidth.forEach(a=>{
        worksheet['!cols']?.push({wpx:a})
      })
    //Center Columns
    columnsToBeCentered.forEach(r=>{
      for(let c=0;c<=range.e.c;c++){
        let h = XLSX.utils.encode_cell({r:0,c:c})
        if(worksheet[h].v==r){
          for(let r=1;r<=range.e.r;r++){
            let cell=worksheet[XLSX.utils.encode_cell({r:r,c:c})]
            cell.s={alignment:{horizontal:'center'}}
          }
        }
      }
    })
    for(let colNum=range.s.c; colNum<=range.e.c; colNum++){{
      let cc = worksheet[XLSX.utils.encode_cell({r: 0, c: colNum})]
      if(!cc.s) cc.s={}
      if(!cc.s.aligment) cc.s.alignment={horizontal:'center'}
      if(!cc.s.font) cc.s.font={}
      if(!cc.s.font.color) cc.s.font.color={rgb:'425563'}
      if(!cc.s.font.bold) cc.s.font.bold=true
      if(!cc.s.fill) cc.s.fill={}
      if(!cc.s.fill.fgColor) cc.s.fill.fgColor={rgb:'FFCD00'}
    }}
    for(let r=1;r<=range.e.r;r++){
      for(let c=0;c<=range.e.c;c++){
        let cell = worksheet[XLSX.utils.encode_cell({r:r,c:c})]
        if(!cell.s) cell.s={}
        if(!cell.s.font) cell.s.font={name: 'arial',sz:10}
      }
    }
  })
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_'+ new  Date().getTime() + EXCEL_EXTENSION);
}
}

