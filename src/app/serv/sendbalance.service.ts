import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';

@Injectable({
  providedIn: 'root'
})
export class SendbalanceService {

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  send(data:any){
    let dia=this.dialog.open(GenericComponent,{disableClose:true, data:{msg:'Generating pdf...'}})
    setTimeout(() => {
      dia.close()
    }, 10000);
    this.http.post(environment.url + 'consuntivo',data,{responseType:'arraybuffer'}).subscribe((o:any)=>{
      if(o){
        const blob = new Blob([o], { type: 'application/pdf' });
        //let w = window.open(URL.createObjectURL(blob),'_blank')
        /**/let downloadURL=URL.createObjectURL(blob)
        var link = document.createElement('a')
        link.href = downloadURL
        let date = data.a110data
        let d = date.substring(0,2)
        let m = date.substring(3,5)
        let y = date.substring(6,10)
        link.download = `${data.a120docBPCS} - ${y}${m}${d} - ${data.a230rig} - ${data.a170customer1}.pdf`
        link.click()
        dia.close()
      } else {
        dia.close()
      }
    })
  }
}
