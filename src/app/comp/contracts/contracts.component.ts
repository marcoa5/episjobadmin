import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewcontactComponent } from '../util/dialog/newcontact/newcontact.component';
import { NewcontractComponent } from './newcontract/newcontract.component';

@Component({
  selector: 'episjob-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  filtro:string=''
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('contracts',this.pos)
        }, 1);
      })
    )
    setTimeout(() => {
      this.allSpin=false
    }, 1000);
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    this.filtro=a
  }

  add(e:any){
    const dia = this.dialog.open(NewcontractComponent, {panelClass:'contract',data:{new:true}})
    dia.afterClosed().subscribe(res=>{
      if(res!=undefined){
        console.log(res)
      }
    })
  }
}
