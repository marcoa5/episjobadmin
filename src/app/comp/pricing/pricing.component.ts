import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

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
  constructor(private auth: AuthServiceService) { }

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

}
