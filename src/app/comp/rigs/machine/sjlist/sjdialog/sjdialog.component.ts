import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { ConsuntivoComponent } from 'src/app/comp/util/dialog/consuntivo/consuntivo.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { HttpClient } from '@angular/common/http'
import {  Observable } from 'rxjs';
import { GetBalanceDataService } from 'src/app/serv/get-balance-data.service';
import { GenericComponent } from 'src/app/comp/util/dialog/generic/generic.component';
import { SendbalanceService } from 'src/app/serv/sendbalance.service';

@Component({
  selector: 'episjob-sjdialog',
  templateUrl: './sjdialog.component.html',
  styleUrls: ['./sjdialog.component.scss']
})
export class SjdialogComponent implements OnInit {
  dataBalance:any
  balanceExists:boolean=false
  large:boolean=false
  constructor(private sendBalance:SendbalanceService, private bal:GetBalanceDataService, private http:HttpClient, private dialog:MatDialog, private auth:AuthServiceService, public dialogRef: MatDialogRef<SjdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.checkBalance()
    this.onResize()
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
    if(window.innerWidth<700) {
      this.large=false
    } else {
      this.large=true
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
    .subscribe((res:any)=>{
      wait.close()
      res.___path=this.data.path
      res.___sn=this.data.matricola
      let dia = this.dialog.open(ConsuntivoComponent, {disableClose:true, panelClass:'consuntivo', data:{data:res}})
    })
  }

  checkBalance(){
    firebase.database().ref('Balance').child(this.data.matricola).child(this.data.path).once('value',info=>{
      if(info.val()!=null) this.balanceExists=true
    })
  }
  downloadBalance(){
    firebase.database().ref('Balance').child(this.data.matricola).child(this.data.path).once('value',info=>{
      if(info.val()!=null) {
        this.sendBalance.send(info.val())
      }
    })
  }

}
