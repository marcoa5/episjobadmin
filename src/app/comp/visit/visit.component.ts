import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
//import 'firebase/database'
//import 'firebase/auth'

@Component({
  selector: 'episjob-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.scss']
})
export class VisitComponent implements OnInit {
  pos:string=''
  day: string=moment(new Date()).format('YYYY-MM-DD')
  userId:string=''
  ref:boolean=false
  allSpin:boolean=true
  allow:boolean=false
  subsList:Subscription[]=[]

  constructor(private route:ActivatedRoute, private auth: AuthServiceService) {}

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      if(a.day) this.day=a.day
    })
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.userId=a.uid
        setTimeout(() => {
          this.allow = this.auth.allow('visit',this.pos)
          this.allSpin=false
        }, 1);
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }
  

  chDay(e:any){
    this.day=e
  }

  refresh(e:any){
    if(e=='ref'){
      let prev = this.day
      this.day=''
      setTimeout(() => {
        this.day=prev
      }, 10);
    } else {
      this.day=e
    }
    
    
  }
}
