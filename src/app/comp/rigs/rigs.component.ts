import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { BackService } from '../../serv/back.service'


@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  rigs:any[] =[]
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  subsList:Subscription[]=[]
  
  
  constructor(public router: Router, public bak:BackService, public auth: AuthServiceService) {}

  ngOnInit(): void {
    this.subsList.push(this.auth._fleet.subscribe(a=>{
      if(a.length>0) {
        setTimeout(() => {
          this.rigs=a
        }, 1);
      }
    }))
    this.largh(1)
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{
      a.unsubscribe()
    })
  }

  back(){
    this.bak.backP()
  }

  open(a: String, b:String, c:String, d:any){
    if(d=='0') {
      console.log('disabled')
    } else{
      this.router.navigate(['machine',{sn:b}])
    }
  }

  scrolla(e:Event){
    
    this.currentPosition = window.pageYOffset
    if(this.currentPosition>this.oldPosition){
      this.scrollaV = false
    } else {
      this.scrollaV = true
    }
    this.oldPosition = this.currentPosition
  }

  scrivi(e: any){
    this.filtro=e.target.value.toString()
  }

  largh(e:any){
    if(window.innerWidth>500) {
      this.lar = true
    } else {
      this.lar=false
    }      
  }

  cancella(){
    this.value=''
    this.filtro=''
  }
  
  filter(a:any){
    this.filtro=a
  }


}
