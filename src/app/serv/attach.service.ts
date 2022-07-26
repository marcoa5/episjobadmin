import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttachmentdialogComponent } from '../comp/contractshome/contracts/attachmentdialog/attachmentdialog.component';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import firebase from 'firebase/app'
import { NewcontractComponent } from '../comp/contractshome/contracts/newcontract/newcontract.component';
@Injectable({
  providedIn: 'root'
})
export class AttachService {

  constructor(private dialog:MatDialog) { }

  attach(e:any){
    let wait = this.dialog.open(GenericComponent, {data: {msg:'Looking for attachments...'}})
    setTimeout(() => {
      wait.close()
    }, 10000);
    let dia:MatDialogRef<AttachmentdialogComponent,any>
    firebase.storage().ref('Contracts').child(e.id).listAll().then(list=>{
      if(list) wait.close()
      if(list.items.length==0) {
        dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:'new'}})
      } else {
        dia = this.dialog.open(AttachmentdialogComponent, {panelClass: 'attachment', data:{info:e,list:list.items}})
      }
    })    
  }

  add(e?:any){
    const dia = this.dialog.open(NewcontractComponent, {panelClass:'contract',data:{new:e?false:true,info:e?e:undefined}})
    dia.afterClosed().subscribe(res=>{
      if(res!=undefined){
        this.attach(res)
      }
    })
  }
}
