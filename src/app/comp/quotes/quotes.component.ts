import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { GetQuoteDataService } from 'src/app/serv/get-quote-data.service';
import { ConsuntivoComponent } from '../util/dialog/consuntivo/consuntivo.component';
import { NewquoteComponent } from './newquote/newquote.component';

@Component({
  selector: 'episjob-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  allow:boolean=false
  subsList:Subscription[]=[]
  pos:string=''
  customers:any[]=[]
  constructor(private auth:AuthServiceService, private dialog: MatDialog, private quote:GetQuoteDataService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Admin',this.pos)
        }, 1);
      }),
      this.auth._customers.subscribe(a=>{
        if(a) this.customers=a
      })
    )
  }

  addNew(){
    let d = this.dialog.open(NewquoteComponent, {panelClass: 'custselect'})
    d.afterClosed().subscribe(async res=>{
      if(res){
        let data:any={}
        data.matricola = res.sn
        data.prodotto1 = res.model
        this.getCustomers(res.custid)
        .then((customer:any)=>{
          data.cliente11=customer.c1
          data.cliente12=customer.c2
          data.cliente13=customer.c3          
          this.quote.generateQuote(data)
          .then((re:any)=>{
            re.___sn=res.sn
            console.log(re)
            return
            let f = this.dialog.open(ConsuntivoComponent, {data: {data:re}})
          })
        })
        
      }
      
    })
  }

  getCustomers(id:string){
    return new Promise(res=>{
      let customer:any=this.customers[this.customers.map(c=>{return c.id}).indexOf(id)]
      res(customer)
    })
  }

}
