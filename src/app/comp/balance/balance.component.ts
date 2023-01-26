import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { SendbalanceService } from 'src/app/serv/sendbalance.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsuntivoComponent } from '../util/dialog/consuntivo/consuntivo.component';
@Component({
  selector: 'episjob-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  filtro:string=''
  subsList:Subscription[]=[]
  allow:boolean=true
  allSpin:boolean=true
  balanceList:any[]=[]
  constructor(private sendBalance:SendbalanceService, private auth:AuthServiceService, private dialog:MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.allSpin=false
    }, 20000);
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.allow=this.auth.allow('TechAdmin',a.Pos)
      })
    )
    this.loadBalance()
  }

  loadBalance(){
    firebase.database().ref('Balance').on('value',a=>{
      if(a.val()!=null){
        a.forEach(b=>{
          if(b.val()!=null){
            b.forEach(c=>{
              let temp:any=c.val()
              temp.___sn=b.key
              temp.___path=c.key
              this.balanceList.push(temp)
              this.allSpin=false
            })
          }
        })
      }
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    this.filtro=a
  }

  pdf(data:any){
    this.sendBalance.send(data)
  }

  edit(data:any){
    let dia = this.dialog.open(ConsuntivoComponent, {disableClose:true, panelClass:'consuntivo', data:{data:data,sn:data.sn,path:data.path}})
  }

}
