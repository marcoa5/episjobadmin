import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { ConsuntivoComponent } from 'src/app/comp/util/dialog/consuntivo/consuntivo.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { HttpClient } from '@angular/common/http'
import { generate, Observable } from 'rxjs';
import { NewcustComponent } from 'src/app/comp/customers/newcust/newcust.component';
import { GetBalanceDataService } from 'src/app/serv/get-balance-data.service';
import { environment } from 'src/environments/environment';
import { GenericComponent } from 'src/app/comp/util/dialog/generic/generic.component';

@Component({
  selector: 'episjob-sjdialog',
  templateUrl: './sjdialog.component.html',
  styleUrls: ['./sjdialog.component.scss']
})
export class SjdialogComponent implements OnInit {
  dataBalance:any
  constructor(private bal:GetBalanceDataService, private http:HttpClient, private dialog:MatDialog, private auth:AuthServiceService, public dialogRef: MatDialogRef<SjdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  download(a:string){
    this.dialogRef.close()
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

  chPos(a:string):boolean{
    return this.auth.acc(a)
  }

  balance(){
    /*
    
    let dia = this.dialog.open(ConsuntivoComponent,{disableClose:true,data:{}})*/
    new Observable((sub)=>{
      if(this.data.balance!=undefined && this.data.balance!=null && this.data.balance!='') {
        firebase.database().ref('Balance').child(this.data.matricola).child(this.data.path).once('value',info=>{
          if(info.val()!=null){
            sub.next(info.val())
          } else {
            sub.next('')
          }
        })
      } else {
        this.bal.generateBalance(this.data)
        .then((result)=>{
          let data:any={}
          data.info = result
          data.type=''
          let dia = this.dialog.open(ConsuntivoComponent, {disableClose:true, data:result})
          /*let dia = this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Creating Balance...'}})
          setTimeout(() => {
            dia.close
          }, 10000);
          this.http.post(environment.url + 'consuntivo',data,{responseType:'arraybuffer'}).subscribe((o:any)=>{
            if(o){
              const blob = new Blob([o], { type: 'application/pdf' });
              let w = window.open(URL.createObjectURL(blob),'_blank')
              dia.close()
            }else {
              dia.close()
            }
          })*/
        })
      }
    }).subscribe(res=>{
      console.log(res)
    })
  }

  getBalance(){
    if(this.data.balance!=undefined && this.data.balance!=null && this.data.balance!='') return 'Edit Balance'
    return 'Generate Balance'
  }

}
