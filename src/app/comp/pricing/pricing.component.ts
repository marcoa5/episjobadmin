import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { NewpricelistComponent } from './newpricelist/newpricelist.component';

@Component({
  selector: 'episjob-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  allow:boolean=true
  subsList:Subscription[]=[]
  pos:string=''
  userId:string=''
  constructor(private auth: AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
          this.pos=a.Pos
          this.userId=a.uid
          setTimeout(() => {
            this.allow=this.auth.allow('SU',this.pos)
          }, 1);
      })
    )
  }

  newPriceList(){
    let dia = this.dialog.open(NewpricelistComponent, {panelClass:'filedialog'})
    dia.afterClosed().subscribe(res=>{
      firebase.database().ref('PSDItems').child(res.period).set(res.list)
    })
  }

}
