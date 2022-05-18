import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { InputhrsComponent } from 'src/app/comp/util/dialog/inputhrs/inputhrs.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Clipboard } from '@angular/cdk/clipboard'
import { CopyComponent } from 'src/app/comp/util/dialog/copy/copy.component';
import { GenericComponent } from 'src/app/comp/util/dialog/generic/generic.component';

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
  constructor(private auth: AuthServiceService, private dialog:MatDialog,public dialogRef: MatDialogRef<PartsdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private clipboard: Clipboard) {}

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
    let exp:string='P/n\tDesc\tqty'
    this.data.parts.forEach((a:any)=>{
      exp+=`\n"${a.pn}"\t${a.desc}\t${a.qty}`
    })
    this.clipboard.copy(exp)
    const dia = this.dialog.open(CopyComponent)
  }

  chPos(a:string){
    return this.auth.acc(a)
  }
}
