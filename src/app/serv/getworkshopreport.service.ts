import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CopyComponent } from '../comp/util/dialog/copy/copy.component';

@Injectable({
  providedIn: 'root'
})
export class GetworkshopreportService {

  constructor(private clip:Clipboard, private dialog:MatDialog) { }

  report(data:any){
    let exp:string=`File:\t${data.file}\nModel:\t${data.model}\nCustomer:\t${data.customer}\nSJ nr.:\t${data.sj?data.sj:''}\nFile nr.:\t${data.fileNr?data.fileNr:''}\n\nDATA\t${data.ws.substring(0,1)}1\t${data.ws.substring(0,1)}2\t${data.ws.substring(0,1)}8\n`
    if(data.days){
      let f:any[] = Object.keys(data.days)
      f.forEach(a=>{
        let temp:any=Object.values(data.days)[f.indexOf(a)]
        if(temp.v1||temp.v2||temp.v8){
          exp+=`${a}\t`
          exp+=`${temp.v1?temp.v1:'0'}\t${temp.v2?temp.v2:'0'}\t${temp.v8?temp.v8:'0'}\n`
        }
      })
      this.clip.copy(exp.replace(/[.]/g,','))
      const d = this.dialog.open(CopyComponent)
    }
  }
}
