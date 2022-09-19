import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import { HttpClient } from '@angular/common/http'
import firebase from 'firebase/app'
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SendSJService {

  constructor(private dialog: MatDialog, private http:HttpClient, private _snackBar:MatSnackBar) { }

  send(id:string, data:any){
    console.log(data)
    data.info.cc=true
    return new Promise((res,rej)=>{
      let url:string=environment.url; 
      let d=this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Generating PDF and sending mail....'}})
      this.http.post(url + 'sendSJNew',data).subscribe(
        result=>{
          console.log(result)
          firebase.database().ref('sjDraft').child('sent').child(id).set(data).then(()=>{
            localStorage.removeItem(id)
            this._snackBar.open('Mail sent to ' + data.elencomail.split(';').join(', '),'',{duration:8000})
            d.close()
            res('')
          })
        },
        error=>{
          console.log('ERRORE: '+ error.message)
          this._snackBar.open('Unable to send mail','',{duration:8000})
          d.close()
          res('')
        })
    })
  }
}
