import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { SendbalanceService } from 'src/app/serv/sendbalance.service';
import { MatDialog } from '@angular/material/dialog';
import { ConsuntivoComponent } from '../util/dialog/consuntivo/consuntivo.component';
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { BalancefromsjComponent } from '../util/dialog/balancefromsj/balancefromsj.component';
import { GenericComponent } from '../util/dialog/generic/generic.component';
import { GetBalanceDataService } from 'src/app/serv/get-balance-data.service';
import { sanitizeIdentifier } from '@angular/compiler';
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
  large:boolean=false
  balanceList:any[]=[]
  constructor(private balance:GetBalanceDataService,  private sendBalance:SendbalanceService, private auth:AuthServiceService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.onResize()
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
      this.balanceList=[]
      if(a.val()!=null){
        a.forEach(b=>{
          if(b.val()!=null){
            b.forEach(c=>{
              let temp:any=c.val()
              temp.___sn=b.key
              temp.___path=c.key
              this.balanceList.push(temp)
              this.balanceList.reverse()
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

  delete(data:any){
    this.dialog.open(DeldialogComponent,{data:{name:'Balance ' + data.a120docBPCS + ' - ' + data.a170customer1}}).afterClosed()
    .subscribe(res=>{
      if(res) {
        firebase.database().ref('Balance').child(data.___sn).child(data.___path).remove()
      }
    })

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<700) {
      this.large=false
    } else {
      this.large=true
    }
  }

  addBalance(){
    this.dialog.open(BalancefromsjComponent,{panelClass:'consuntivo', data:''}).afterClosed().subscribe(res=>{
      if(res){
        let dia = this.dialog.open(GenericComponent, {disableClose:true, data:{msg: 'Collecting data...'}})
        setTimeout(() => {
          dia.close()
        }, 10000);
        firebase.database().ref('Saved').child(res.sn).child(res.path).once('value',a=>{
          if(a.val()!=null) {
            let data:any= a.val()
            data.___sn = res.sn
            data.___path = res.path
            this.balance.generateBalance(data)
            .then((re:any)=>{
              re.___sn = res.sn
              re.___path = res.path
              this.dialog.open(ConsuntivoComponent,{panelClass:'consuntivo',data:{data:re}})
              dia.close()
            })
          }
        })
      }
    })
  }

}
