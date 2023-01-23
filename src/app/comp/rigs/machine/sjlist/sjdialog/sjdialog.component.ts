import { Component, HostListener, Inject, OnInit } from '@angular/core';
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<500) {
      return true
    } else {
      return false
    }
  }

  balance(){
    let wait = this.dialog.open(GenericComponent,{disableClose:true,data:{msg:'Opening Balance...'}})
    new Observable((sub)=>{
      firebase.database().ref('Balance').child(this.data.matricola).child(this.data.path).once('value',info=>{
        if(info.val()!=null){
          sub.next(info.val())
          console.log('existing')
        } else {
          if(this.data!=undefined){
            this.bal.generateBalance(this.data)
            .then((result)=>{
              sub.next(result)
              console.log('new')
            })
          }
        }
      })
    })
    .subscribe(res=>{
      wait.close()
      let dia = this.dialog.open(ConsuntivoComponent, {disableClose:true, panelClass:'consuntivo', data:{data:res,sn:this.data.matricola,path:this.data.path}})
    })
  }

  getBalance(){
    if(this.onResize()){
      return 'Balance'
    } else {
      if(this.data.balance!=undefined && this.data.balance!=null && this.data.balance!='') return 'Edit Balance'
      return 'Generate Balance' 
    }
  }

}
