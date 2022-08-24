import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { InputhrsComponent } from 'src/app/comp/util/dialog/inputhrs/inputhrs.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Clipboard } from '@angular/cdk/clipboard'
import * as XLSX from 'xlsx-js-style'
import { GenericComponent } from 'src/app/comp/util/dialog/generic/generic.component';
import { ExcelService } from 'src/app/serv/excelexport.service'

@Component({
  selector: 'episjob-partsdialog',
  templateUrl: './partsdialog.component.html',
  styleUrls: ['./partsdialog.component.scss']
})
export class PartsdialogComponent implements OnInit {
  pos:string=''
  displayedColumns: string[]=['pnshort','p/n', 'Description', 'LLP', 'Qty', 'Tot']
  test:boolean=false
  subsList:Subscription[]=[]
  constructor(private excel:ExcelService, private auth: AuthServiceService, private dialog:MatDialog,public dialogRef: MatDialogRef<PartsdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
        }
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }
  
  onNoClick(){
    this.dialogRef.close()
  }

  mod(a:any,i:number, cat:string){
    if(this.auth.acc('SURights')){
      const gg = this.dialog.open(InputhrsComponent,{panelClass: cat=='desc'?'input-parts-dialog':'', data:{hr:a[cat]}})
      gg.afterClosed().subscribe(y=>{
        if(y) {
          this.test=true
          this.data.parts[i][cat]=y
          if(cat=='qty') this.data.parts[i]['tot']=this.data.parts[i]['llp']*y
          firebase.database().ref('PartReqSent').child(this.data.id).child('Parts').child(i.toString()).child(cat).set(y)
        }
      })
    }
  }

  download(){
    let name:string=''
    firebase.database().ref('PartReqSent').child(this.data.id).once('value',k=>{
      name=k.val().sn + ' - ' + k.val().date
    })
    .then(()=>{
      const d = this.dialog.open(GenericComponent,{disableClose:true, data:{msg:'Retreiving data...'}})
      setTimeout(() => {
        d.close
      }, 20000);
      let out:any[]=[]//:string='P/n\tDesc\tqty'
      let check:number=0
      let length:number=this.data.parts.length
      new Promise(res=>{
        this.data.parts.forEach((a:any)=>{
          out.push({
            Pn:a.pn,
            Description:a.desc,
            LLp:a.llp,
            Qty:a.qty,
            Tot:0        
          })
          check++
          if(check==length) res('')
        })
      })
      .then(()=>{
        if(out.length>0) {
          out.sort((a:any,b:any)=>{
            if(a.Date>b.Date) return 1
            if(a.Date<b.Date) return -1
            return 0
          })
          let cols:string[]=['Pn','Qty']
          let colWidth:any[]=[120,250,60]
  
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(out)
          let range=XLSX.utils.decode_range(worksheet['!ref']!)
          for(let r=1;r<=range.e.r;r++){
            let cel = worksheet[XLSX.utils.encode_cell({r:r,c:range.e.c})]
            let c2=XLSX.utils.encode_cell({r:r,c:range.e.c-1})
            let c1=XLSX.utils.encode_cell({r:r,c:range.e.c-2})
            cel.f=c1 + '*' + c2
            cel.z="#,##0.00"
            worksheet[c1].z="#,##0.00"
          }
          let Sheets:any={}
          Sheets[name]=worksheet
          const workbook: XLSX.WorkBook = { 
            Sheets, 
            SheetNames: [name] 
          }
          this.excel.exportAsExcelFile(workbook,name + ' - Parts request',cols,colWidth)
          d.close()
        } else {
          alert('No data to be exported')
          d.close()
        }
      })
    })
  }

  chPos(a:string){
    return this.auth.acc(a)
  }
}
