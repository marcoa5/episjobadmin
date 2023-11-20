import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { GenericComponent } from '../comp/util/dialog/generic/generic.component';
import { HttpClient } from '@angular/common/http'
import firebase from 'firebase/app'
import { MatSnackBar } from '@angular/material/snack-bar';
import { EpirocvsfeaComponent } from '../comp/util/dialog/epirocvsfea/epirocvsfea.component';
@Injectable({
  providedIn: 'root'
})
export class SendSJService {
  constructor(private dialog: MatDialog, private http:HttpClient, private _snackBar:MatSnackBar) { }

  async send(id:string, data:any){
    return new Promise(async (resolve,rej)=>{
      await this.getInfo(data).then((rex:any)=>{
        console.log(rex)
        if(rex[0]==true && rex[1].split('@')[1]=='feaservice.it'){
          //let g = this.dialog.open(EpirocvsfeaComponent,{disableClose:true})
          //g.afterClosed().subscribe(res=>{
            //if(res){
              data.heading = 'fea'
            //}})
        }
        this.sj(id,data).then(()=>{resolve('')})
      })
    })  
  }

  sj(id:string, data:any){
    return new Promise((res,rej)=>{
      let url:string=environment.url; 
      let d=this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Generating PDF and sending mail....'}})
      data.info.cc = true
      this.http.post(url + 'sendSJNew',data).subscribe(
        result=>{
          console.log(result)
          localStorage.removeItem(id)
          this._snackBar.open('Mail sent to ' + data.elencomail.split(';').join(', '),'',{duration:8000})
          d.close()
          res('')
        },
        error=>{
          //localStorage.setItem(id,JSON.stringify(data))
          console.log('ERRORE: '+ error.message)
          this._snackBar.open('Unable to send mail','',{duration:8000})
          d.close()
          rej('')
        }
      )
    })
  }

  getInfo(data:any){
    let fea:boolean=false
    return new Promise((res,rej)=>{
      firebase.database().ref('RigAuth').child(data.matricola).child('a98').once('value',y=>{
        if(y.val()!=null && y.val()>0) {
          fea=true
        }
        this.getEmail(data.userId).then(mail=>{
          res([fea,mail])
        })
      })
    })
  }

  getEmail(id:string){
    let email:string=''
    return new Promise((res,rej)=>{
      this.http.get(environment.url + 'getusers').subscribe((users:any)=>{
        if(users){
          let index:number=users.map((u:any)=>{return u.uid}).indexOf(id)
          if(index>0) email = users[index].email
          res(email)
        } else {
          res('')
        }
      })
    })
  }

}
