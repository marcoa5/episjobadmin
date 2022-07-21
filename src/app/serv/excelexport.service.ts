import { Injectable } from '@angular/core'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx-js-style'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExcelService {
constructor() { }
public exportAsExcelFile(workbook:XLSX.WorkBook, excelFileName: string): void {
  workbook.SheetNames.forEach(a=>{
    let worksheet:XLSX.WorkSheet=workbook.Sheets[a]
    let range=XLSX.utils.decode_range(worksheet['!ref']!)
    for(let colNum=range.s.c; colNum<=range.e.c; colNum++){{
      let cc = worksheet[XLSX.utils.encode_cell({r: 0, c: colNum})]
      cc.s={
        alignment:{
          horizontal:'center'
        },
        font:{
          color:{
            rgb:'425563'
          },
          bold:true
        }, 
        fill:{
          fgColor: {
            rgb:'FFCD00'
          }/*, bgColor:{rgb:'425563'}*/}
        }
    }}
    for(let r=1;r<=range.e.r;r++){
      for(let c=0;c<=range.e.c;c++){
        let cell = worksheet[XLSX.utils.encode_cell({r:r,c:c})]
        cell.s={
          font:{
            name: 'arial',
            sz:10
          }
        }
      }
    }
  })
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_'+ /*new  Date().getTime() +*/ EXCEL_EXTENSION);
}
}

